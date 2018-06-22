
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