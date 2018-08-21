import p5 from 'p5';
import {
    BOUNDARY,
    NO_BOUNDARY,
    getArrowBoundaryDictionary,
    locationKey,
    arrowBoundaryKey,
    boundaryKey
} from './arrows-logic';

let stateDrawing;
let previousTime;
let mouseX = 1;
let mouseY = 1;
let cellSize = 1;
const gridCanvasSize = 320;
const gridCanvasBorderSize = 2;
const convertPixelToIndex = pixel => Math.floor(
    (pixel - gridCanvasBorderSize) / cellSize
);
// const nat = () => chance.natural({
//     min: 0,
//     max: 255,
// });

export const getAdderWithMousePosition = (arrowAdder) => (e) => {
    if (mouseX > 0 + gridCanvasBorderSize &&
        mouseX < gridCanvasSize - gridCanvasBorderSize &&
        mouseY > 0 + gridCanvasBorderSize &&
        mouseY < gridCanvasSize - gridCanvasBorderSize
    ) {
        const mouseXindex = convertPixelToIndex(mouseX);
        const mouseYindex = convertPixelToIndex(mouseY);
        arrowAdder(mouseXindex, mouseYindex, e);
    } else {
    }
};
export const setUpCanvas = (state) => {
    stateDrawing = state;
    previousTime = new Date();
    const triangleDrawingArray = [
        (topLeft, cellSize, sketch) => sketch.triangle(
            topLeft.x + (cellSize / 2.0), topLeft.y,
            topLeft.x + cellSize, topLeft.y + cellSize,
            topLeft.x, topLeft.y + cellSize
        ),
        (topLeft, cellSize, sketch) => sketch.triangle(
            topLeft.x, topLeft.y,
            topLeft.x + cellSize, topLeft.y + (cellSize / 2.0),
            topLeft.x, topLeft.y + cellSize
        ),
        (topLeft, cellSize, sketch) => sketch.triangle(
            topLeft.x, topLeft.y,
            topLeft.x + cellSize, topLeft.y,
            topLeft.x + (cellSize / 2.0), topLeft.y + cellSize
        ),
        (topLeft, cellSize, sketch) => sketch.triangle(
            topLeft.x + cellSize, topLeft.y,
            topLeft.x + cellSize, topLeft.y + cellSize,
            topLeft.x, topLeft.y + (cellSize / 2.0)
        )
    ];
    const triangleRotatingArray = [

        (cellSize, sketch, percentage) => sketch.triangle(
            cellSize / 2.0, -(cellSize * percentage),
            cellSize, cellSize - (cellSize * percentage),
            0, cellSize - (cellSize * percentage)
        ),
        (cellSize, sketch, percentage) => sketch.triangle(
            0 + cellSize * percentage, cellSize - (cellSize * percentage),
            (cellSize / 2) + (cellSize * percentage * 1.5), 0.5 * cellSize * percentage,
            cellSize, cellSize
        ),
        (cellSize, sketch, percentage) => sketch.quad(
            0, cellSize,
            cellSize / 2, cellSize * percentage,
            cellSize, cellSize,
            cellSize / 2, cellSize + cellSize * percentage),
        (cellSize, sketch, percentage) => sketch.triangle(
            0, cellSize,
            (cellSize / 2) - (1.5 * cellSize * percentage), 0.5 * cellSize * percentage,
            cellSize - (cellSize * percentage), cellSize - (cellSize * percentage))
    ];
    const translateAndRotate = (topLeft, sketch, vector, cellSize) => {
        const xShift = vector === 1 || vector === 2 ? cellSize : 0;
        const yShift = vector === 2 || vector === 3 ? cellSize : 0;
        sketch.translate(topLeft.x + xShift, topLeft.y + yShift);
        sketch.angleMode(sketch.DEGREES);
        sketch.rotate(90 * vector);
    };
    const timeShift = ({ x, y }, vector, shiftAmount) => {
        const shifted = [
            { x, y: y - shiftAmount },
            { x: x + shiftAmount, y },
            { x, y: y + shiftAmount },
            { x: x - shiftAmount, y },
        ];
        return shifted[vector];
    };

    const drawingContext = (sketch) => {
        // eslint-disable-next-line no-param-reassign
        sketch.setup = () => {
            sketch.createCanvas(gridCanvasSize + gridCanvasBorderSize * 2, gridCanvasSize + gridCanvasBorderSize * 2).parent('sketch-holder').id('arrows-animation');
        };
        // eslint-disable-next-line no-param-reassign
        sketch.draw = () => {
            mouseX = sketch.mouseX;
            mouseY = sketch.mouseY;
            // draw background slash border
            sketch.background(255, 255, 255);
            // draw grid
            sketch.strokeWeight(0);
            sketch.fill(0, 0, 0);
            sketch.rect(gridCanvasBorderSize, gridCanvasBorderSize, gridCanvasSize, gridCanvasSize);
            //draw grid lines
            cellSize = (gridCanvasSize * 1.0) / (1.0 * stateDrawing.grid.size);
            sketch.push();
            sketch.stroke(45, 45, 45);
            sketch.strokeWeight(2);
            for (var i=1; i<stateDrawing.grid.size; i++) {
                // horizontal
                sketch.line(1+gridCanvasBorderSize, 1+gridCanvasBorderSize + i * cellSize, gridCanvasSize, 1 + i * cellSize);
                // vertical
                sketch.line(1+gridCanvasBorderSize + i * cellSize, 1+gridCanvasBorderSize, 1 + i * cellSize, gridCanvasSize,);
            }
            sketch.pop();

            sketch.fill(255, 255, 255);
            sketch.strokeWeight(0);
            const convertIndexToPixel = index => (index * cellSize) + gridCanvasBorderSize;
            const convertArrowToTopLeft = xy => (
                {
                    x: convertIndexToPixel(xy.x),
                    y: convertIndexToPixel(xy.y)
                }
            );
            const timeDiff = new Date().getTime() - previousTime.getTime();
            const possiblePercentage = ((
                stateDrawing.playing ? timeDiff : 0
            ) / (
                1.0 * stateDrawing.noteLength
            ));
            const percentage = possiblePercentage > 1 ? 1 : possiblePercentage;
            const boundaryDictionary = getArrowBoundaryDictionary(
                stateDrawing.grid.arrows || [],
                stateDrawing.grid.size,
                boundaryKey
            );
            const boundaryDictionaryX = boundaryDictionary['x'] || [];
            const boundaryDictionaryY = boundaryDictionary['y'] || [];
            // draw highlighted rows and columns
            boundaryDictionaryX.map((arrow) => {
                const topLeft = {
                    x:convertIndexToPixel(0),
                    y:convertIndexToPixel(arrow.y)
                };

                sketch.push();
                sketch.strokeWeight(0);
                const scaledColor = 255*percentage*2+(percentage>.5?(-255*(percentage-.5)*2*2):0);
                sketch.fill(scaledColor, scaledColor, scaledColor, scaledColor);
                translateAndRotate(topLeft, sketch, 0, cellSize);
                sketch.rect(0, 0, cellSize*stateDrawing.grid.size, cellSize)

                sketch.pop();
                return undefined;
            });
            boundaryDictionaryY.map((arrow) => {
                const topLeft = {
                    x:convertIndexToPixel(arrow.x),
                    y:convertIndexToPixel(0)
                };

                sketch.push();
                sketch.strokeWeight(0);
                const scaledColor = 255*percentage*2+(percentage>.5?(-255*(percentage-.5)*2*2):0);
                sketch.fill(scaledColor, scaledColor, scaledColor, scaledColor);
                translateAndRotate(topLeft, sketch, 0, cellSize);
                sketch.rect(0, 0, cellSize, cellSize*stateDrawing.grid.size)

                sketch.pop();
                return undefined;
            });

            // draw arrows

            const arrowLocationDictionary = getArrowBoundaryDictionary(
                stateDrawing.grid.arrows,
                stateDrawing.grid.size,
                locationKey
            );

            // non-rotated arrows
            const arrowsToNotRotateDictionary = Object.keys(arrowLocationDictionary).reduce(
                (acc, location) => (
                    arrowLocationDictionary[location].length === 1 ?
                        [
                            ...acc,
                            ...arrowLocationDictionary[location],
                        ] :
                        acc
                ),
                []
            );
            // non-wall Arrows
            const arrowDictionary = getArrowBoundaryDictionary(
                arrowsToNotRotateDictionary,
                stateDrawing.grid.size,
                arrowBoundaryKey
            );
            (arrowDictionary[NO_BOUNDARY] || []).map((arrow) => {
                const shiftedTopLeft = timeShift(
                    convertArrowToTopLeft(arrow),
                    arrow.vector,
                    cellSize * percentage
                );
                const triangleDrawer = triangleDrawingArray[arrow.vector];
                triangleDrawer(shiftedTopLeft, cellSize, sketch);
                return undefined;
            });
            // wall Arrows
            (arrowDictionary[BOUNDARY] || []).map((arrow) => {
                sketch.push();
                sketch.strokeWeight(0);
                sketch.fill(255, 255, 255);
                const topLeft = convertArrowToTopLeft(arrow);
                translateAndRotate(topLeft, sketch, arrow.vector, cellSize);
                sketch.quad(
                    0, cellSize,
                    cellSize / 2, cellSize * percentage,
                    cellSize, cellSize,
                    cellSize / 2, cellSize + cellSize * percentage
                );
                sketch.pop();
                return undefined;
            });
            // rotating Arrows

            const arrowsToRotateDictionary = Object.keys(arrowLocationDictionary).reduce(
                (acc, location) => (
                    arrowLocationDictionary[location].length !== 1 ?
                        {
                            ...acc,
                            [location]: arrowLocationDictionary[location],
                        } :
                        acc
                ),
                {}
            );
            Object.keys(arrowsToRotateDictionary).map((arrowsToRotateIndex) => {
                const rotations = (
                    (
                        arrowsToRotateDictionary[arrowsToRotateIndex].length % 4
                    ) || 4
                ) - 1;
                const bouncedRotation = (rotations + 2) % 4;
                // draw not bounced
                const bouncingDictionary = getArrowBoundaryDictionary(
                    arrowsToRotateDictionary[arrowsToRotateIndex],
                    stateDrawing.grid.size,
                    arrowBoundaryKey,
                    rotations
                );
                const arrowsNotBouncing = bouncingDictionary[NO_BOUNDARY] || [];
                arrowsNotBouncing.map((arrow) => {
                    const topLeft = convertArrowToTopLeft(arrow);
                    
                    sketch.push();
                    sketch.strokeWeight(0);
                    sketch.fill(255, 255, 255);
                    translateAndRotate(topLeft, sketch, arrow.vector, cellSize);
                    
                    triangleRotatingArray[rotations](cellSize, sketch, percentage);
                    
                    sketch.pop();
                    return undefined;
                });
                
                const arrowsBouncing = bouncingDictionary[BOUNDARY] || [];

                // bounced
                arrowsBouncing.map((arrow) => {
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
            const mouseXindex = convertPixelToIndex(sketch.mouseX);
            const mouseYindex = convertPixelToIndex(sketch.mouseY);
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
    new p5(drawingContext);
};
export const updateCanvas = (state, date) => {
    if (state.playing !== stateDrawing.playing ||
        state.noteLength!==stateDrawing.noteLength ||
        state.grid.id!==stateDrawing.grid.id ||
        state.currentPreset!==stateDrawing.currentPreset) {

            if(state.noteLength!==stateDrawing.noteLength || date.getTime() - previousTime.getTime()>=stateDrawing.noteLength-40){
                previousTime = date;
            }

            stateDrawing = state;
    }
};
