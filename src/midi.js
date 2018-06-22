// let selectMIDIOut = null;
// let midiAccess = null;
// let midiOut = null;

// function onMIDIFail(err) {
//     alert(`MIDI initialization failed. ${err}`);
// }

// function changeMIDIOut(ev) {
//     try {
//         const selectedID = selectMIDIOut[selectMIDIOut.selectedIndex].value;
//         const outputsIterator = midiAccess.outputs.values();
//         let nextOutput = outputsIterator.next();
//         while (!nextOutput.done) {
//             if (selectedID === nextOutput.value.id) {
//                 midiOut = nextOutput.value;
//             }
//             nextOutput = outputsIterator.next();
//         }
//         if (selectedID === undefined) {
//             midiOut = undefined;
//         }
//     } catch (err) {
//         console.log(`MIDI is not supported by your browser access ${ev}`);
//     }
// }
// function onMIDIInit(midi) {
//     midiAccess = midi;
//     selectMIDIOut = document.getElementById('midiOut');

//     // clear the MIDI output select
//     selectMIDIOut.options.length = 0;
//     selectMIDIOut.add(new Option('Select Device', undefined, false, false));
//     const outputsIterator = midiAccess.outputs.values();
//     let nextOutput = outputsIterator.next();
//     while (!nextOutput.done) {
//         selectMIDIOut.add(
//             new Option(nextOutput.value.name, nextOutput.value.id, false, false)
//         );
//         nextOutput = outputsIterator.next();
//     }
//     selectMIDIOut.onchange = changeMIDIOut;
// }
// export const midiUtils = () => {
//     try {
//         navigator.requestMIDIAccess({}).then(onMIDIInit, onMIDIFail);
//     } catch (err) {
//         console.log('MIDI is not supported by your browser access ');
//     }
//     return {
//         changeMIDIOut
//     }
// }