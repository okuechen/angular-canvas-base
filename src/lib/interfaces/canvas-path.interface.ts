/**
 * Define a path that will be filled or stroked if close is called. Current set fill and stroke styles
 * are used.
 */
export interface ICanvasPath {

    /**
     * True if the path is still open and close was not called yet.
     */
    isPathOpen(): boolean;

    /**
     * Move directly to a specific location.
     */
    moveTo(x: number, y: number): ICanvasPath;

    /**
     * Draw a line from current location to destination.
     */
    lineTo(x: number, y: number): ICanvasPath;

    /**
     * Move in an quadratic curve to a specific location.
     */
    quadraticCurveTo(x: number, y: number, x2: number, y2: number): ICanvasPath;

    /**
     * Move in arc shape to a specific location.
     */
    arcTo(x: number, y: number, x2: number, y2: number, radius: number): ICanvasPath;

    /**
     * Close the path and render it by filling, stroking or both.
     */
    close(fill: boolean, stroke: boolean): void;
}
