'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.updateCanvas = exports.setUpCanvas = exports.getAdderWithMousePosition = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _p = require('p5');

var _p2 = _interopRequireDefault(_p);

var _arrowsLogic = require('./arrows-logic');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let stateDrawing;
let previousTime;
let mouseX = 1;
let mouseY = 1;
let mouseXstart = 1;
let mouseYstart = 1;
let cellSize = 1;
let thisArrowAdder = function () {};
let mouseIsPressed;
const gridCanvasSize = 320;
const gridCanvasBorderSize = 2;

const arrowColor = [255, 255, 255, 45];
const convertPixelToIndex = function (pixel) {
    return Math.floor((pixel - gridCanvasBorderSize) / cellSize);
};
// const nat = () => chance.natural({
//     min: 0,
//     max: 255,
// });
const mouseIsInSketch = function () {
    return mouseX > 0 + gridCanvasBorderSize && mouseX < gridCanvasSize - gridCanvasBorderSize && mouseY > 0 + gridCanvasBorderSize && mouseY < gridCanvasSize - gridCanvasBorderSize;
};
const getAdderWithMousePosition = exports.getAdderWithMousePosition = function (arrowAdder) {
    return function (e) {
        thisArrowAdder = arrowAdder;
        if (mouseIsInSketch()) {
            const mouseXindex = convertPixelToIndex(mouseX);
            const mouseYindex = convertPixelToIndex(mouseY);
            arrowAdder(mouseXindex, mouseYindex, e);
        } else {}
    };
};
const setUpCanvas = exports.setUpCanvas = function (state) {
    stateDrawing = state;
    previousTime = new Date();
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
            mouseX = sketch.mouseX;
            mouseY = sketch.mouseY;
            mouseIsPressed = sketch.mouseIsPressed;

            const setMouseStart = function (e) {
                mouseXstart = mouseX;
                mouseYstart = mouseY;
                const mouseXindex = convertPixelToIndex(mouseX);
                const mouseYindex = convertPixelToIndex(mouseY);
                if (mouseIsInSketch()) {
                    thisArrowAdder(mouseXindex, mouseYindex, e, true);
                }
            };
            const setTouchStart = function (e) {
                mouseXstart = mouseX;
                mouseYstart = mouseY;
                const mouseXindex = convertPixelToIndex(mouseX);
                const mouseYindex = convertPixelToIndex(mouseY);
                if (mouseIsPressed && mouseIsInSketch()) {
                    thisArrowAdder(mouseXindex, mouseYindex, e, true);
                }
            };
            const sameAsStart = function () {
                const mouseXindex = convertPixelToIndex(mouseX);
                const mouseYindex = convertPixelToIndex(mouseY);
                const mouseXindexStart = convertPixelToIndex(mouseXstart);
                const mouseYindexStart = convertPixelToIndex(mouseYstart);
                return mouseXindexStart === mouseXindex && mouseYindexStart === mouseYindex;
            };
            const setMouseEnd = function (e) {
                mouseXstart = -1000;
                mouseYstart = -1000;
            };

            sketch.touchStarted = setTouchStart;
            sketch.touchEnded = setMouseEnd;
            sketch.mousePressed = setMouseStart;
            sketch.mouseReleased = setMouseEnd;

            const onDrag = function (e) {

                if (mouseIsPressed && mouseIsInSketch() && !sameAsStart()) {
                    const mouseXindex = convertPixelToIndex(mouseX);
                    const mouseYindex = convertPixelToIndex(mouseY);
                    thisArrowAdder(mouseXindex, mouseYindex, e);
                    e.preventDefault();
                }
            };
            sketch.mouseDragged = onDrag;
            sketch.touchMoved = onDrag;

            // draw grid
            sketch.push();
            sketch.strokeWeight(0);
            sketch.fill(0, 0, 0, 70);
            sketch.rect(gridCanvasBorderSize, gridCanvasBorderSize, gridCanvasSize, gridCanvasSize);
            sketch.noFill();
            sketch.strokeWeight(gridCanvasBorderSize * 2);
            sketch.stroke(255, 255, 255, 160);
            sketch.rect(0, 0, gridCanvasSize + gridCanvasBorderSize * 2, gridCanvasSize + gridCanvasBorderSize * 2);

            sketch.pop();
            //draw grid lines
            cellSize = gridCanvasSize * 1.0 / (1.0 * stateDrawing.grid.size);
            sketch.push();
            sketch.stroke(30, 30, 30, 40);
            sketch.strokeWeight(2);
            for (var i = 1; i < stateDrawing.grid.size; i++) {
                // horizontal
                sketch.line(1 + gridCanvasBorderSize, 1 + gridCanvasBorderSize + i * cellSize, gridCanvasSize, 1 + i * cellSize);
                // vertical
                sketch.line(1 + gridCanvasBorderSize + i * cellSize, 1 + gridCanvasBorderSize, 1 + i * cellSize, gridCanvasSize);
            }
            sketch.pop();

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
            const possiblePercentage = (stateDrawing.playing ? timeDiff : 0) / (1.0 * stateDrawing.noteLength);
            const percentage = possiblePercentage > 1 ? 1 : possiblePercentage;
            const boundaryDictionary = (0, _arrowsLogic.getArrowBoundaryDictionary)(stateDrawing.grid.arrows || [], stateDrawing.grid.size, _arrowsLogic.boundaryKey);
            const boundaryDictionaryX = boundaryDictionary['x'] || [];
            const boundaryDictionaryY = boundaryDictionary['y'] || [];
            // draw highlighted rows and columns

            if (stateDrawing.playing) {
                const prepareDrawForColumnsAndRows = function (topLeft) {
                    sketch.push();
                    sketch.strokeWeight(0);
                    // const scaledColor = 255*percentage*2+(percentage>.5?(-255*(percentage-.5)*2*2):0);
                    const scaledColor = 200 - 200 * percentage;
                    sketch.fill(scaledColor, scaledColor, scaledColor, scaledColor / 3);
                    translateAndRotate(topLeft, sketch, 0, cellSize);
                    return scaledColor;
                };
                boundaryDictionaryX.map(function (arrow) {
                    const topLeft = {
                        x: convertIndexToPixel(0),
                        y: convertIndexToPixel(arrow.y)
                    };

                    prepareDrawForColumnsAndRows(topLeft);
                    sketch.rect(0, 0, cellSize * stateDrawing.grid.size, cellSize);

                    sketch.pop();
                    return undefined;
                });
                boundaryDictionaryY.map(function (arrow) {
                    const topLeft = {
                        x: convertIndexToPixel(arrow.x),
                        y: convertIndexToPixel(0)
                    };
                    prepareDrawForColumnsAndRows(topLeft);
                    sketch.rect(0, 0, cellSize, cellSize * stateDrawing.grid.size);

                    sketch.pop();
                    return undefined;
                });
            }
            // draw arrows

            const arrowLocationDictionary = (0, _arrowsLogic.getArrowBoundaryDictionary)(stateDrawing.grid.arrows, stateDrawing.grid.size, _arrowsLogic.locationKey);

            // non-rotated arrows
            const arrowsToNotRotateDictionary = Object.keys(arrowLocationDictionary).reduce(function (acc, location) {
                return arrowLocationDictionary[location].length === 1 ? [...acc, ...arrowLocationDictionary[location]] : acc;
            }, []);
            // non-wall Arrows
            const arrowDictionary = (0, _arrowsLogic.getArrowBoundaryDictionary)(arrowsToNotRotateDictionary, stateDrawing.grid.size, _arrowsLogic.arrowBoundaryKey);
            (arrowDictionary[_arrowsLogic.NO_BOUNDARY] || []).map(function (arrow) {
                sketch.push();
                sketch.strokeWeight(0);
                sketch.fill(...arrowColor);
                const shiftedTopLeft = timeShift(convertArrowToTopLeft(arrow), arrow.vector, cellSize * percentage);
                const triangleDrawer = triangleDrawingArray[arrow.vector];
                triangleDrawer(shiftedTopLeft, cellSize, sketch);
                sketch.pop();
                return undefined;
            });
            // wall Arrows
            (arrowDictionary[_arrowsLogic.BOUNDARY] || []).map(function (arrow) {
                sketch.push();
                sketch.strokeWeight(0);
                sketch.fill(...arrowColor);
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
                    sketch.fill(...arrowColor);
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
                    sketch.fill(...arrowColor);
                    translateAndRotate(topLeft, sketch, arrow.vector, cellSize);
                    triangleRotatingArray[bouncedRotation](cellSize, sketch, percentage);

                    sketch.pop();
                    return undefined;
                });
                return undefined;
            });

            // draw hover input
            sketch.cursor(sketch.CROSS);
            if (!stateDrawing.deleting) {
                sketch.cursor(sketch.HAND);
                // triangleDrawingArray[stateDrawing.inputDirection](
                //     convertArrowToTopLeft(
                //         {
                //             x: mouseXindex,
                //             y: mouseYindex
                //         }
                //     ),
                //     cellSize,
                //     sketch
                // );
            }
            // eslint-disable-next-line no-param-reassign
            // sketch.touchEnded = (e) => {
            //     if (sketch.mouseX > 0 + gridCanvasBorderSize &&
            //         sketch.mouseX < gridCanvasSize - gridCanvasBorderSize &&
            //         sketch.mouseY > 0 + gridCanvasBorderSize &&
            //         sketch.mouseY < gridCanvasSize - gridCanvasBorderSize
            //     ) {
            //         if (arrowAdder) {
            //             arrowAdder(mouseXindex, mouseYindex, e);
            //             return false;
            //         }
            //     } else {
            //     }
            // };
        };
    };

    // eslint-disable-next-line
    new _p2.default(drawingContext);
};
const updateCanvas = exports.updateCanvas = function (state, date) {
    if (state.playing !== stateDrawing.playing || state.noteLength !== stateDrawing.noteLength || state.grid.id !== stateDrawing.grid.id || state.currentPreset !== stateDrawing.currentPreset) {

        if (state.noteLength !== stateDrawing.noteLength || date.getTime() - previousTime.getTime() >= stateDrawing.noteLength - 40) {
            previousTime = date;
        }

        stateDrawing = state;
    }
};