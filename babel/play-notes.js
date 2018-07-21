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
// const frequencies = notesFrequencies('C3 D3 E3 F3 G3 A3 B3 C4 D4 E4 F4 G4 A4 B4 C5 D5 E5 F5 G5 A5');//c Scale
const frequencies = (0, _notesFrequencies2.default)('e3 a3 b3 c4 e4 f4 a4 b4 e5 a5 b5 c6 e6 f6 a6 b6 e7'); //ake bono scale
// const frequencies = notesFrequencies('e3 b3 d4 e4 g4 a4 d5 e5 b5 d6 e6 g6 a6 d7 e7');//Yue-Diao scale
// const frequencies = notesFrequencies('e3 a3 b3 C3 D3 E3 F3 G3 A3 E4 F4 G4 A4');//Bayati scale
// const sounds = (length) => frequencies.map((freq, noteIndex)=>{
// const aSound = new Pizzicato.Sound({
//     source: 'wave',
//     options: {
//         frequency: frequencies[noteIndex][0],
//         attack: 0,
//         release: 0.1,
//         type: 'sine',
//         volume: .5
//     },
// });
// var dubDelay = new Pizzicato.Effects.DubDelay({
//     feedback: 0.1,
//     time: length*2.5/1000,
//     mix: 1,
//     cutoff: 200
// });
// var dubDelay2 = new Pizzicato.Effects.DubDelay({
//     feedback: 0.1,
//     time: length*3.33/1000,
//     mix: 1,
//     cutoff: 700
// });
// var lowPassFilter = new Pizzicato.Effects.LowPassFilter({
//     frequency: 1000,
//     peak: 6
// });

// aSound.addEffect(dubDelay);
// aSound.addEffect(dubDelay2);
// aSound.addEffect(lowPassFilter);
//     return aSound;
// })
const lengthSounds = {};
const makePizzaSound = exports.makePizzaSound = function (index, length) {
    //cacheSounds!
    // const frequencies = notesFrequencies('D3 F3 G#3 C4 D#4 G4 A#5');
    const noteIndex = index % frequencies.length;
    const aSound = new _pizzicato2.default.Sound({
        source: 'wave',
        options: {
            frequency: frequencies[noteIndex][0],
            attack: 0.01,
            release: 0.1,
            type: 'sawtooth',
            volume: .5
        }
    });
    return aSound;
};
const playSounds = exports.playSounds = function (boundaryArrows, size, length, muted) {
    const alreadyPlayedMap = {};
    var sounds = [];

    // var dubDelay = new Pizzicato.Effects.DubDelay({
    //     feedback: 0.1,
    //     time: length*1.5/1000,
    //     mix: 1,
    //     cutoff: 200
    // });
    // var distortion = new Pizzicato.Effects.Distortion({
    //     gain: 1
    // });
    // var lowPassFilter = new Pizzicato.Effects.LowPassFilter({
    //     frequency: 800,
    //     peak: .1
    // });

    boundaryArrows.map(function (arrow) {
        const speed = getIndex(arrow.x, arrow.y, size, arrow.vector);

        if (!muted && !alreadyPlayedMap[speed]) {
            alreadyPlayedMap[speed] = [speed];
            const snd = makePizzaSound(speed, length);
            sounds.push(snd);
        }
        (0, _midi.makeMIDImessage)(speed, length).play();
    });
    if (!muted) {
        // group.addEffect(dubDelay);
        // group.addEffect(distortion);
        // group.addEffect(lowPassFilter);

        var group = new _pizzicato2.default.Group(sounds);
        group.play();
        setTimeout(function () {
            group.stop();
            sounds.map(function (sound) {
                group.removeSound(sound);
            });
        }, length - 1);
    }
};