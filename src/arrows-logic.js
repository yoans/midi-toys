
import * as R from 'ramda';
import Chance from 'chance';

const chance = new Chance();
const NO_BOUNDARY = 'no-boundary';
const BOUNDARY = 'boundary';
// const vectors = [
//     'arrow-up',
//     'arrow-right',
//     'arrow-down',
//     'arrow-left',
// ];
const vectorOperations = [
    ({ x, y, vector }) => ({ x, y: y - 1, vector }),
    ({ x, y, vector }) => ({ x: x + 1, y, vector }),
    ({ x, y, vector }) => ({ x, y: y + 1, vector }),
    ({ x, y, vector }) => ({ x: x - 1, y, vector }),
];
const getVector = () => chance.natural({
    min: 0,
    max: 3,
});
const cycleVector = (vector, number) => (vector + number - 1) % 4;
const getRandomNumber = size => chance.natural({
    min: 0,
    max: size - 1,
});
// const getRows = size => R.range(0, size).map(() => R.range(0, size));
const getArrow = size => () => ({
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
// const seedGrid = () => newGrid(getRandomNumber(20) + 12, getRandomNumber(50) + 1);
const moveArrow = arrow => vectorOperations[arrow.vector](arrow);
const arrowKey = arrow => `{x:${arrow.x},y:${arrow.y},vector:${arrow.vector}}`;
const locationKey = arrow => `{x:${arrow.x},y:${arrow.y}}`;

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
const newArrayIfFalsey = thingToCheck => (thingToCheck || []);
const rotateArrow = number => arrow => ({
    ...arrow,
    vector: cycleVector(arrow.vector, number),
});
const rotateSet = set => set.map(rotateArrow(set.length));
const flipArrow = ({ vector, ...rest }) => ({ vector: (vector + 2) % 4, ...rest });
const getArrowBoundaryDictionary = (arrows, size, keyFunc, rotations) => arrows.reduce(
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

export const nextGrid = (grid, length) => {
    const {
        size,
        arrows
    } = grid;
    const arrowsWithVectorDictionary = getArrowBoundaryDictionary(arrows, size, arrowKey);
    const reducedArrows = Object.keys(arrowsWithVectorDictionary).reduce(
        (acc, arrowsWithSameVectorKey) => {
            const arrowsAtIndex = arrowsWithVectorDictionary[arrowsWithSameVectorKey];
            const reducedArrowsAtIndex = R.take(arrowsAtIndex.length % 4 || 4, arrowsAtIndex);
            return [...acc, ...reducedArrowsAtIndex];
        }
        , [],
    );
    const arrowSetDictionary = getArrowBoundaryDictionary(reducedArrows, size, locationKey);

    const noisyArrowBoundaryDictionary = getArrowBoundaryDictionary(arrows, size, arrowBoundaryKey);
    playSounds(newArrayIfFalsey(noisyArrowBoundaryDictionary[BOUNDARY]), size, length, grid.muted);

    const arrowSets = Object.keys(arrowSetDictionary).map(key => arrowSetDictionary[key]);
    const rotatedArrows = arrowSets.map(rotateSet);
    const flatRotatedArrows = rotatedArrows.reduce(
        (accum, current) => [...accum, ...current],
        []
    );

    const arrowBoundaryDictionary = getArrowBoundaryDictionary(
        flatRotatedArrows, size, arrowBoundaryKey
    );
    const movedArrowsInMiddle = newArrayIfFalsey(
        arrowBoundaryDictionary[NO_BOUNDARY]).map(moveArrow
    );
    const movedFlippedBoundaryArrows = newArrayIfFalsey(
        arrowBoundaryDictionary[BOUNDARY]).map(flipArrow).map(moveArrow
    );

    return {
        ...grid,
        size,
        arrows: [
            ...movedArrowsInMiddle,
            ...movedFlippedBoundaryArrows,
        ],
    };
};
