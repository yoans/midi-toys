'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.nextGrid = exports.getArrowBoundaryDictionary = exports.arrowBoundaryKey = exports.locationKey = exports.arrowKey = exports.newGrid = exports.addToGrid = exports.removeFromGrid = exports.BOUNDARY = exports.NO_BOUNDARY = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _playNotes = require('./play-notes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const chance = new _chance2.default();
const NO_BOUNDARY = exports.NO_BOUNDARY = 'no-boundary';
const BOUNDARY = exports.BOUNDARY = 'boundary';
// const vectors = [
//     'arrow-up',
//     'arrow-right',
//     'arrow-down',
//     'arrow-left',
// ];
const vectorOperations = [function ({ x, y, vector }) {
    return { x, y: y - 1, vector };
}, function ({ x, y, vector }) {
    return { x: x + 1, y, vector };
}, function ({ x, y, vector }) {
    return { x, y: y + 1, vector };
}, function ({ x, y, vector }) {
    return { x: x - 1, y, vector };
}];
const getVector = function () {
    return chance.natural({
        min: 0,
        max: 3
    });
};
const cycleVector = function (vector, number) {
    return (vector + number - 1) % 4;
};
const getRandomNumber = function (size) {
    return chance.natural({
        min: 0,
        max: size - 1
    });
};
// const getRows = size => R.range(0, size).map(() => R.range(0, size));
const getArrow = function (size) {
    return function () {
        return {
            x: getRandomNumber(size),
            y: getRandomNumber(size),
            vector: getVector()
        };
    };
};
const removeFromGrid = exports.removeFromGrid = function (grid, x, y) {
    const nextGrid = _extends({}, grid, {
        arrows: grid.arrows.filter(function (arrow) {
            return arrow.x !== x || arrow.y !== y;
        })
    });
    return nextGrid;
};
const addToGrid = exports.addToGrid = function (grid, x, y, dir) {
    const nextGrid = _extends({}, grid, {
        arrows: [...grid.arrows, {
            x,
            y,
            vector: dir
        }]
    });
    return nextGrid;
};
const newGrid = exports.newGrid = function (size, numberOfArrows) {
    const arrows = R.range(0, numberOfArrows).map(getArrow(size));

    return { size, arrows, muted: true };
};
// const seedGrid = () => newGrid(getRandomNumber(20) + 12, getRandomNumber(50) + 1);
const moveArrow = function (arrow) {
    return vectorOperations[arrow.vector](arrow);
};
const arrowKey = exports.arrowKey = function (arrow) {
    return `{x:${arrow.x},y:${arrow.y},vector:${arrow.vector}}`;
};
const locationKey = exports.locationKey = function (arrow) {
    return `{x:${arrow.x},y:${arrow.y}}`;
};

const arrowBoundaryKey = exports.arrowBoundaryKey = function (arrow, size, rotations = 0) {
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
const newArrayIfFalsey = function (thingToCheck) {
    return thingToCheck || [];
};
const rotateArrow = function (number) {
    return function (arrow) {
        return _extends({}, arrow, {
            vector: cycleVector(arrow.vector, number)
        });
    };
};
const rotateSet = function (set) {
    return set.map(rotateArrow(set.length));
};
const flipArrow = function (_ref) {
    let { vector } = _ref,
        rest = _objectWithoutProperties(_ref, ['vector']);

    return _extends({ vector: (vector + 2) % 4 }, rest);
};
const getArrowBoundaryDictionary = exports.getArrowBoundaryDictionary = function (arrows, size, keyFunc, rotations) {
    return arrows.reduce(function (arrowDictionary, arrow) {
        const key = keyFunc(arrow, size, rotations);
        const arrayAtKey = [...newArrayIfFalsey(arrowDictionary[key]), arrow];
        const newArrowDictionary = _extends({}, arrowDictionary, {
            [key]: arrayAtKey
        });

        return newArrowDictionary;
    }, {});
};

const nextGrid = exports.nextGrid = function (grid, length) {
    const {
        size,
        arrows
    } = grid;
    const arrowsWithVectorDictionary = getArrowBoundaryDictionary(arrows, size, arrowKey);
    const reducedArrows = Object.keys(arrowsWithVectorDictionary).reduce(function (acc, arrowsWithSameVectorKey) {
        const arrowsAtIndex = arrowsWithVectorDictionary[arrowsWithSameVectorKey];
        const reducedArrowsAtIndex = R.take(arrowsAtIndex.length % 4 || 4, arrowsAtIndex);
        return [...acc, ...reducedArrowsAtIndex];
    }, []).filter(function (arrow) {
        return arrow.x >= 0 && arrow.y >= 0 && arrow.x < size && arrow.y < size;
    });
    const arrowSetDictionary = getArrowBoundaryDictionary(reducedArrows, size, locationKey);

    const noisyArrowBoundaryDictionary = getArrowBoundaryDictionary(arrows, size, arrowBoundaryKey);
    (0, _playNotes.playSounds)(newArrayIfFalsey(noisyArrowBoundaryDictionary[BOUNDARY]), size, length, grid.muted);

    const arrowSets = Object.keys(arrowSetDictionary).map(function (key) {
        return arrowSetDictionary[key];
    });
    const rotatedArrows = arrowSets.map(rotateSet);
    const flatRotatedArrows = rotatedArrows.reduce(function (accum, current) {
        return [...accum, ...current];
    }, []);

    const arrowBoundaryDictionary = getArrowBoundaryDictionary(flatRotatedArrows, size, arrowBoundaryKey);
    const movedArrowsInMiddle = newArrayIfFalsey(arrowBoundaryDictionary[NO_BOUNDARY]).map(moveArrow);
    const movedFlippedBoundaryArrows = newArrayIfFalsey(arrowBoundaryDictionary[BOUNDARY]).map(flipArrow).map(moveArrow);

    return _extends({}, grid, {
        size,
        arrows: [...movedArrowsInMiddle, ...movedFlippedBoundaryArrows]
    });
};