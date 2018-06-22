import React from 'react';
import ReactDOM from 'react-dom';
import p5 from 'p5';
import {Application} from './app';


// const makeMIDImessage = (index, length) => {
// const midiKeyNumbers = [
//     45, 47, 48, 50, 52, 54, 55, 57, 59, 61, 62, 64, 66, 67, 69, 71, 73, 74
// ];
//     const noteIndex = index % midiKeyNumbers.length;

//     return {
//         play() {
//             (midiOut || { send: () => { } }).send([
//                 0x90,
//                 midiKeyNumbers[noteIndex],
//                 0x40,
//             ]);
//             setTimeout(() => {
//                 (midiOut || { send: () => { } }).send([
//                     0x80,
//                     midiKeyNumbers[noteIndex],
//                     0x00,
//                 ]);
//             }, length - 1);
//         },
//     };
// };


// const nat = () => chance.natural({
//     min: 0,
//     max: 255,
// });

// eslint-disable-next-line no-undef
particlesJS('particles-js', 'src/assets/particles.json', () => {});

// eslint-disable-next-line no-undef
ReactDOM.render(<Application/>, document.getElementById('root'));
