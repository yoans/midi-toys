'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.updateCanvas = exports.setUpCanvas = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _p = require('p5');

var _p2 = _interopRequireDefault(_p);

var _arrowsLogic = require('./arrows-logic');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let stateDrawing;
let previousTime;

// const nat = () => chance.natural({
//     min: 0,
//     max: 255,
// });

const setUpCanvas = exports.setUpCanvas = function (state, arrowAdder) {
    stateDrawing = state;
    previousTime = new Date();
    const gridCanvasSize = 180;
    const gridCanvasBorderSize = 4;
    const triangleDrawingArray = [function (topLeft, cellSize, sketch) {
        return sketch.triangle(topLeft.x + cellSize / 2.0, topLeft.y, topLeft.x + cellSize, topLeft.y + cellSize, topLeft.x, topLeft.y + cellSize);
    }, function (topLeft, cellSize, sketch) {
        return sketch.triangle(topLeft.x, topLeft.y, topLeft.x + cellSize, topLeft.y + cellSize / 2.0, topLeft.x, topLeft.y + cellSize);
    }, function (topLeft, cellSize, sketch) {
        return sketch.triangle(topLeft.x, topLeft.y, topLeft.x + cellSize, topLeft.y, topLeft.x + cellSize / 2.0, topLeft.y + cellSize);
    }, function (topLeft, cellSize, sketch) {
        return sketch.triangle(topLeft.x + cellSize, topLeft.y, topLeft.x + cellSize, topLeft.y + cellSize, topLeft.x, topLeft.y + cellSize / 2.0);
    }];
    const triangleRotatingArray = [function (cellSize, sketch, percentage) {
        return sketch.triangle(cellSize / 2.0, -(cellSize * percentage), cellSize, cellSize - cellSize * percentage, 0, cellSize - cellSize * percentage);
    }, function (cellSize, sketch, percentage) {
        return sketch.triangle(0 + cellSize * percentage, cellSize - cellSize * percentage, cellSize / 2 + cellSize * percentage * 1.5, 0.5 * cellSize * percentage, cellSize, cellSize);
    }, function (cellSize, sketch, percentage) {
        return sketch.quad(0, cellSize, cellSize / 2, cellSize * percentage, cellSize, cellSize, cellSize / 2, cellSize + cellSize * percentage);
    }, function (cellSize, sketch, percentage) {
        return sketch.triangle(0, cellSize, cellSize / 2 - 1.5 * cellSize * percentage, 0.5 * cellSize * percentage, cellSize - cellSize * percentage, cellSize - cellSize * percentage);
    }];
    const translateAndRotate = function (topLeft, sketch, vector, cellSize) {
        const xShift = vector === 1 || vector === 2 ? cellSize : 0;
        const yShift = vector === 2 || vector === 3 ? cellSize : 0;
        sketch.translate(topLeft.x + xShift, topLeft.y + yShift);
        sketch.angleMode(sketch.DEGREES);
        sketch.rotate(90 * vector);
    };
    const timeShift = function ({ x, y }, vector, shiftAmount) {
        const shifted = [{ x, y: y - shiftAmount }, { x: x + shiftAmount, y }, { x, y: y + shiftAmount }, { x: x - shiftAmount, y }];
        return shifted[vector];
    };

    const drawingContext = function (sketch) {
        // eslint-disable-next-line no-param-reassign
        sketch.setup = function () {
            sketch.createCanvas(gridCanvasSize + gridCanvasBorderSize * 2, gridCanvasSize + gridCanvasBorderSize * 2).parent('sketch-holder').id('arrows-animation');
        };
        // eslint-disable-next-line no-param-reassign
        sketch.draw = function () {
            // draw background slash border
            sketch.background(255, 255, 255);
            // draw grid
            sketch.strokeWeight(0);
            sketch.fill(0, 0, 0);
            sketch.rect(gridCanvasBorderSize, gridCanvasBorderSize, gridCanvasSize, gridCanvasSize);

            const cellSize = gridCanvasSize * 1.0 / (1.0 * stateDrawing.grid.size);
            sketch.fill(255, 255, 255);
            const convertIndexToPixel = function (index) {
                return index * cellSize + gridCanvasBorderSize;
            };
            const convertArrowToTopLeft = function (xy) {
                return {
                    x: convertIndexToPixel(xy.x),
                    y: convertIndexToPixel(xy.y)
                };
            };
            const timeDiff = new Date().getTime() - previousTime.getTime();
            const percentage = (stateDrawing.playing ? timeDiff : 0) / (1.0 * stateDrawing.noteLength);

            // draw arrows

            const arrowLocationDictionary = (0, _arrowsLogic.getArrowBoundaryDictionary)(stateDrawing.grid.arrows, stateDrawing.grid.size, _arrowsLogic.locationKey);

            // non-rotated arrows
            const arrowsToNotRotateDictionary = Object.keys(arrowLocationDictionary).reduce(function (acc, location) {
                return arrowLocationDictionary[location].length === 1 ? [...acc, ...arrowLocationDictionary[location]] : acc;
            }, []);
            // non-wall Arrows
            const arrowDictionary = (0, _arrowsLogic.getArrowBoundaryDictionary)(arrowsToNotRotateDictionary, stateDrawing.grid.size, _arrowsLogic.arrowBoundaryKey);
            (arrowDictionary[_arrowsLogic.NO_BOUNDARY] || []).map(function (arrow) {
                const shiftedTopLeft = timeShift(convertArrowToTopLeft(arrow), arrow.vector, cellSize * percentage);
                const triangleDrawer = triangleDrawingArray[arrow.vector];
                triangleDrawer(shiftedTopLeft, cellSize, sketch);
                return undefined;
            });
            // wall Arrows
            (arrowDictionary[_arrowsLogic.BOUNDARY] || []).map(function (arrow) {
                sketch.push();
                sketch.strokeWeight(0);
                sketch.fill(255, 255, 255);
                const topLeft = convertArrowToTopLeft(arrow);
                translateAndRotate(topLeft, sketch, arrow.vector, cellSize);
                sketch.quad(0, cellSize, cellSize / 2, cellSize * percentage, cellSize, cellSize, cellSize / 2, cellSize + cellSize * percentage);
                sketch.pop();
                return undefined;
            });
            // rotating Arrows

            const arrowsToRotateDictionary = Object.keys(arrowLocationDictionary).reduce(function (acc, location) {
                return arrowLocationDictionary[location].length !== 1 ? _extends({}, acc, {
                    [location]: arrowLocationDictionary[location]
                }) : acc;
            }, {});
            Object.keys(arrowsToRotateDictionary).map(function (arrowsToRotateIndex) {
                const rotations = (arrowsToRotateDictionary[arrowsToRotateIndex].length % 4 || 4) - 1;
                const bouncedRotation = (rotations + 2) % 4;
                // draw not bounced
                const bouncingDictionary = (0, _arrowsLogic.getArrowBoundaryDictionary)(arrowsToRotateDictionary[arrowsToRotateIndex], stateDrawing.grid.size, _arrowsLogic.arrowBoundaryKey, rotations);
                const arrowsNotBouncing = bouncingDictionary[_arrowsLogic.NO_BOUNDARY] || [];
                arrowsNotBouncing.map(function (arrow) {
                    const topLeft = convertArrowToTopLeft(arrow);

                    sketch.push();
                    sketch.strokeWeight(0);
                    sketch.fill(255, 255, 255);
                    translateAndRotate(topLeft, sketch, arrow.vector, cellSize);

                    triangleRotatingArray[rotations](cellSize, sketch, percentage);

                    sketch.pop();
                    return undefined;
                });

                const arrowsBouncing = bouncingDictionary[_arrowsLogic.BOUNDARY] || [];

                // bounced
                arrowsBouncing.map(function (arrow) {
                    const topLeft = convertArrowToTopLeft(arrow);

                    sketch.push();
                    sketch.strokeWeight(0);
                    sketch.fill(255, 255, 255);
                    translateAndRotate(topLeft, sketch, arrow.vector, cellSize);
                    triangleRotatingArray[bouncedRotation](cellSize, sketch, percentage);

                    sketch.pop();
                    return undefined;
                });
                return undefined;
            });

            // draw hover input
            sketch.cursor(sketch.CROSS);
            const convertPixelToIndex = function (pixel) {
                return Math.floor((pixel - gridCanvasBorderSize) / cellSize);
            };
            const mouseXindex = convertPixelToIndex(sketch.mouseX);
            const mouseYindex = convertPixelToIndex(sketch.mouseY);
            if (!stateDrawing.deleting) {
                triangleDrawingArray[stateDrawing.inputDirection](convertArrowToTopLeft({
                    x: mouseXindex,
                    y: mouseYindex
                }), cellSize, sketch);
            }
            // eslint-disable-next-line no-param-reassign
            sketch.touchEnded = function (e) {
                if (sketch.mouseX > 0 + gridCanvasBorderSize && sketch.mouseX < gridCanvasSize - gridCanvasBorderSize && sketch.mouseY > 0 + gridCanvasBorderSize && sketch.mouseY < gridCanvasSize - gridCanvasBorderSize) {
                    if (arrowAdder) {
                        arrowAdder(mouseXindex, mouseYindex, e);
                        return false;
                    }
                } else {
                    console.log('click in the canvas please');
                }
            };
        };
    };

    // eslint-disable-next-line
    new _p2.default(drawingContext);
};
const updateCanvas = exports.updateCanvas = function (state, date) {
    previousTime = date;
    stateDrawing = state;
};