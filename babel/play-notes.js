'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.playSounds = exports.makePizzaSound = undefined;

var _pizzicato = require('pizzicato');

var _pizzicato2 = _interopRequireDefault(_pizzicato);

var _notesFrequencies = require('notes-frequencies');

var _notesFrequencies2 = _interopRequireDefault(_notesFrequencies);

var _midi = require('./midi');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getIndex = function (x, y, size, vector) {
    if (vector === 1 || vector === 3) {
        return y;
    } else if (vector === 0 || vector === 2) {
        return x;
    }
    return 0;
};

const makePizzaSound = exports.makePizzaSound = function (index, length) {
    // const frequencies = notesFrequencies('D3 F3 G#3 C4 D#4 G4 A#5');
    const frequencies = (0, _notesFrequencies2.default)('A3 B3 C3 D3 E3 F3 G3 A4 B4 C4 D4 E4 F4 G4 A5 B5 C5 D5 E5 F5 G5');
    const noteIndex = index % frequencies.length;
    const aSound = new _pizzicato2.default.Sound({
        source: 'wave',
        options: {
            frequency: frequencies[noteIndex][0],
            attack: 0.1,
            release: 0.1,
            type: 'triangle'
        }
    });
    const distortion = new _pizzicato2.default.Effects.Distortion({
        gain: 0.8
    });

    aSound.addEffect(distortion);

    const reverb = new _pizzicato2.default.Effects.Reverb({
        time: length / 2.0,
        decay: length / 2.0,
        reverse: true,
        mix: 0.7
    });

    aSound.addEffect(reverb);
    return {
        play() {
            aSound.play();
            setTimeout(function () {
                aSound.stop();
            }, length - 1);
        }
    };
};
const playSounds = exports.playSounds = function (boundaryArrows, size, length, muted) {
    const alreadyPlayedMap = {};
    boundaryArrows.map(function (arrow) {
        const speed = getIndex(arrow.x, arrow.y, size, arrow.vector);

        if (!muted && !alreadyPlayedMap[speed]) {
            alreadyPlayedMap[speed] = [speed];
            const snd = makePizzaSound(speed, length);
            snd.play();
        }
        (0, _midi.makeMIDImessage)(speed, length).play();
        return undefined;
    });
};