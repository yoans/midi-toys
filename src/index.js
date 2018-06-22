import React from 'react';
import ReactDOM from 'react-dom';
import Chance from 'chance';
import * as R from 'ramda';
import Pizzicato from 'pizzicato';
import notesFrequencies from 'notes-frequencies';
import p5 from 'p5';



const chance = new Chance();
const NO_BOUNDARY = 'no-boundary';
const BOUNDARY = 'boundary';

export const vectors = [
    'arrow-up',
    'arrow-right',
    'arrow-down',
    'arrow-left',
];
export const vectorOperations = [
    ({ x, y, vector }) => ({ x, y: y - 1, vector }),
    ({ x, y, vector }) => ({ x: x + 1, y, vector }),
    ({ x, y, vector }) => ({ x, y: y + 1, vector }),
    ({ x, y, vector }) => ({ x: x - 1, y, vector }),
];
export const getVector = () => chance.natural({
    min: 0,
    max: 3,
});
export const cycleVector = (vector, number) => (vector + number - 1) % 4;
export const getRandomNumber = size => chance.natural({
    min: 0,
    max: size - 1,
});
export const getRows = size => R.range(0, size).map(() => R.range(0, size));
export const getArrow = size => () => ({
    x: getRandomNumber(size),
    y: getRandomNumber(size),
    vector: getVector(),
});
export const removeFromGrid = (grid, x, y) => {
    const nextGrid = {
        ...grid,
        arrows: grid.arrows.filter(arrow => arrow.x !== x || arrow.y !== y),
    };
    return nextGrid;
};
export const addToGrid = (grid, x, y, dir) => {
    const nextGrid = {
        ...grid,
        arrows: [
            ...grid.arrows,
            {
                x,
                y,
                vector: dir,
            },
        ],
    };
    return nextGrid;
};
export const newGrid = (size, numberOfArrows) => {
    const arrows = R.range(0, numberOfArrows).map(getArrow(size));

    return { size, arrows, muted: true };
};
export const seedGrid = () => newGrid(getRandomNumber(20) + 12, getRandomNumber(50) + 1);
export const moveArrow = arrow => vectorOperations[arrow.vector](arrow);
export const arrowKey = arrow => `{x:${arrow.x},y:${arrow.y},vector:${arrow.vector}}`;
export const locationKey = arrow => `{x:${arrow.x},y:${arrow.y}}`;

export const arrowBoundaryKey = (arrow, size, rotations = 0) => {
    if (arrow.y === 0 && (arrow.vector + rotations) % 4 === 0) {
        return BOUNDARY;
    }
    if (arrow.x === size - 1 && (arrow.vector + rotations) % 4 === 1) {
        return BOUNDARY;
    }
    if (arrow.y === size - 1 && (arrow.vector + rotations) % 4 === 2) {
        return BOUNDARY;
    }
    if (arrow.x === 0 && (arrow.vector + rotations) % 4 === 3) {
        return BOUNDARY;
    }
    return NO_BOUNDARY;
};
export const newArrayIfFalsey = thingToCheck => (thingToCheck || []);
export const rotateArrow = number => arrow => ({
    ...arrow,
    vector: cycleVector(arrow.vector, number),
});
export const rotateSet = set => set.map(rotateArrow(set.length));
export const flipArrow = ({ vector, ...rest }) => ({ vector: (vector + 2) % 4, ...rest });
export const getArrowBoundaryDictionary = (arrows, size, keyFunc, rotations) => arrows.reduce(
    (arrowDictionary, arrow) => {
        const key = keyFunc(arrow, size, rotations);
        const arrayAtKey = [
            ...(newArrayIfFalsey(arrowDictionary[key])),
            arrow,
        ];
        const newArrowDictionary = {
            ...arrowDictionary,
            [key]: arrayAtKey
        };

        return newArrowDictionary;
    }
    , {},
);
const getIndex = (x, y, size, vector) => {
    if (vector === 1 || vector === 3) {
        return y;
    } else if (vector === 0 || vector === 2) {
        return x;
    }
    return 0;
};

// const makeMIDImessage = (index, length) => {
//     const midiKeyNumbers = [45, 47, 48, 50, 52, 54, 55, 57, 59, 61, 62, 64, 66, 67, 69, 71, 73, 74];
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
const makePizzaSound = (index, length) => {
    // const frequencies = notesFrequencies('D3 F3 G#3 C4 D#4 G4 A#5');
    const frequencies = notesFrequencies('A3 B3 C3 D3 E3 F3 G3 A4 B4 C4 D4 E4 F4 G4 A5 B5 C5 D5 E5 F5 G5');
    const noteIndex = index % frequencies.length;
    const aSound = new Pizzicato.Sound({
        source: 'wave',
        options: {
            frequency: frequencies[noteIndex][0],
            attack: 0.1,
            release: 0.1,
            type: 'triangle',
        },
    });
    const distortion = new Pizzicato.Effects.Distortion({
        gain: 0.8,
    });

    aSound.addEffect(distortion);

    const reverb = new Pizzicato.Effects.Reverb({
        time: length / 2.0,
        decay: length / 2.0,
        reverse: true,
        mix: 0.7,
    });

    aSound.addEffect(reverb);
    return {
        play() {
            aSound.play();
            setTimeout(() => {
                aSound.stop();
            }, length - 1);
        },
    };
};
export const playSounds = (boundaryArrows, size, length, muted) => {
    boundaryArrows.map((arrow) => {
        const speed = getIndex(arrow.x, arrow.y, size, arrow.vector);

        if (!muted) {
            const snd = makePizzaSound(speed, length);
            snd.play();
        }

        // const midiMessage = makeMIDImessage(speed, length);
        // midiMessage.play();
        return undefined;
    });
};

// const nat = () => chance.natural({
//     min: 0,
//     max: 255,
// });
let stateDrawing = {
    grid: {
        arrows: [],
        size: 1,
    },
};

particlesJS('particles-js', 'src/assets/particles.json', () => {});

// eslint-disable-next-line no-undef
ReactDOM.render(<Application/>, document.getElementById('root'));
