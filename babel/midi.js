'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
let selectMIDIOut = null;
let midiAccess = null;
let midiOut = null;

function onMIDIFail(err) {
    document.getElementById('midiOut').outerHTML = '';
    document.getElementById('midiOut-label').outerHTML = '';
    // console.log(`MIDI initialization failed. ${err}`);
}

const makeMIDImessage = exports.makeMIDImessage = function (index, length) {
    const midiKeyNumbers = [45, 47, 48, 50, 52, 54, 55, 57, 59, 61, 62, 64, 66, 67, 69, 71, 73, 74];
    const noteIndex = index % midiKeyNumbers.length;

    return {
        play() {
            (midiOut || { send: function () {} }).send([0x90, midiKeyNumbers[noteIndex], 0x40]);
            setTimeout(function () {
                (midiOut || { send: function () {} }).send([0x80, midiKeyNumbers[noteIndex], 0x00]);
            }, length - 1);
        }
    };
};

const changeMIDIOut = function (ev) {
    try {
        const selectedID = selectMIDIOut[selectMIDIOut.selectedIndex].value;
        const outputsIterator = midiAccess.outputs.values();
        let nextOutput = outputsIterator.next();
        while (!nextOutput.done) {
            if (selectedID === nextOutput.value.id) {
                midiOut = nextOutput.value;
            }
            nextOutput = outputsIterator.next();
        }
        if (selectedID === undefined) {
            midiOut = undefined;
        }
    } catch (err) {
        // console.log(`MIDI is not supported by your browser access ${ev}`);
    }
};
const onMIDIInit = function (midi) {
    midiAccess = midi;
    // eslint-disable-next-line no-undef
    selectMIDIOut = document.getElementById('midiOut');

    // clear the MIDI output select
    selectMIDIOut.options.length = 0;
    // eslint-disable-next-line no-undef
    selectMIDIOut.add(new Option('Select MIDI Device', undefined, false, false));
    const outputsIterator = midiAccess.outputs.values();
    let nextOutput = outputsIterator.next();
    while (!nextOutput.done) {
        selectMIDIOut.add(
        // eslint-disable-next-line no-undef
        new Option(nextOutput.value.name, nextOutput.value.id, false, false));
        nextOutput = outputsIterator.next();
    }
    selectMIDIOut.onchange = changeMIDIOut;
};
const midiUtils = exports.midiUtils = function () {
    try {
        // eslint-disable-next-line no-undef
        navigator.requestMIDIAccess({}).then(onMIDIInit, onMIDIFail);
    } catch (err) {
        // console.log('MIDI is not supported by your browser access ');
    }
};