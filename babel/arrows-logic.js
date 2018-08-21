'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.nextGrid = exports.getArrowBoundaryDictionary = exports.boundaryKey = exports.arrowBoundaryKey = exports.locationKey = exports.arrowKey = exports.emptyGrid = exports.newGrid = exports.addToGrid = exports.removeFromGrid = exports.BOUNDARY = exports.NO_BOUNDARY = undefined;

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
        id: chance.guid(),
        arrows: grid.arrows.filter(function (arrow) {
            return arrow.x !== x || arrow.y !== y;
        })
    });
    return nextGrid;
};
const getMirror = function (pos, gridSize) {
    var half = Math.floor(gridSize / 2);
    var offset = half - pos;
    var location = half + offset;
    if (gridSize % 2 === 0) {
        location = location - 1;
    }
    return location;
};
const getForwardDiagMirror = function (xpos, ypos, gridSize) {
    return { x: getMirror(ypos, gridSize), y: getMirror(xpos, gridSize) };
};
const getBackwardDiagMirror = function (xpos, ypos) {
    return { x: ypos, y: xpos };
};
const calculateForwardDiagonalVector = function (vector) {
    return [1, 0, 3, 2][vector];
};
const calculateBackwardDiagonalVector = function (vector) {
    return [3, 2, 1, 0][vector];
};
const calculateHorizontalVector = function (vector) {
    return [2, 1, 0, 3][vector];
};
const calculateVerticalDiagonalVector = function (vector) {
    return [0, 3, 2, 1][vector];
};
const addToGrid = exports.addToGrid = function (grid, x, y, dir, symmetries, inputNumber) {
    if (grid.arrows.length > 200) {
        return grid;
    }
    const symmetricArrowsToAdd = R.range(0, inputNumber).map(function () {
        return { x, y, vector: dir };
    });
    const skipForthSymmetry = symmetries.horizontalSymmetry && symmetries.verticalSymmetry && symmetries.backwardDiagonalSymmetry;
    if (symmetries.horizontalSymmetry) {
        symmetricArrowsToAdd.map(function (arrowToMirror) {
            return symmetricArrowsToAdd.push(_extends({}, arrowToMirror, {
                y: getMirror(arrowToMirror.y, grid.size),
                vector: calculateHorizontalVector(arrowToMirror.vector)
            }));
        });
    }
    if (symmetries.verticalSymmetry) {
        symmetricArrowsToAdd.map(function (arrowToMirror) {
            return symmetricArrowsToAdd.push(_extends({}, arrowToMirror, {
                x: getMirror(arrowToMirror.x, grid.size),
                vector: calculateVerticalDiagonalVector(arrowToMirror.vector)
            }));
        });
    }
    if (symmetries.backwardDiagonalSymmetry) {
        symmetricArrowsToAdd.map(function (arrowToMirror) {
            return symmetricArrowsToAdd.push(_extends({}, arrowToMirror, getBackwardDiagMirror(arrowToMirror.x, arrowToMirror.y), {
                vector: calculateBackwardDiagonalVector(arrowToMirror.vector)
            }));
        });
    }
    if (symmetries.forwardDiagonalSymmetry && !skipForthSymmetry) {
        symmetricArrowsToAdd.map(function (arrowToMirror) {
            return symmetricArrowsToAdd.push(_extends({}, arrowToMirror, getForwardDiagMirror(arrowToMirror.x, arrowToMirror.y, grid.size), {
                vector: calculateForwardDiagonalVector(arrowToMirror.vector)
            }));
        });
    }
    grid.id = chance.guid();
    return symmetricArrowsToAdd.reduce(function (accumGrid, arrow) {
        return addOneToGrid(accumGrid, arrow.x, arrow.y, arrow.vector);
    }, grid);
};

const addOneToGrid = function (grid, x, y, dir) {
    const nextGrid = _extends({}, grid, {
        id: chance.guid(),
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
    return { size: size, id: chance.guid(), arrows, muted: true };
};

const emptyGrid = exports.emptyGrid = function (size) {
    return { size: size, id: chance.guid(), arrows: [], muted: true };
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
    const returnVal = boundaryKey(arrow, size, rotations);
    return returnVal === 'x' || returnVal === 'y' ? BOUNDARY : returnVal;
};

const boundaryKey = exports.boundaryKey = function (arrow, size, rotations = 0) {
    if (arrow.y === 0 && (arrow.vector + rotations) % 4 === 0) {
        return 'y';
    }
    if (arrow.x === size - 1 && (arrow.vector + rotations) % 4 === 1) {
        return 'x';
    }
    if (arrow.y === size - 1 && (arrow.vector + rotations) % 4 === 2) {
        return 'y';
    }
    if (arrow.x === 0 && (arrow.vector + rotations) % 4 === 3) {
        return 'x';
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
    const nextGridArrows = [...movedArrowsInMiddle, ...movedFlippedBoundaryArrows];
    const noisyArrowBoundaryDictionary = getArrowBoundaryDictionary(nextGridArrows, size, arrowBoundaryKey);
    (0, _playNotes.playSounds)(newArrayIfFalsey(noisyArrowBoundaryDictionary[BOUNDARY]), size, length, grid.muted);
    return _extends({}, grid, {
        id: chance.guid(),
        size,
        arrows: nextGridArrows
    });
};