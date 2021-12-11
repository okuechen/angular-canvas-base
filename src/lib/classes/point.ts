/**
 * Defines a point inside the canvas, x / y coordinate.
 */
export class Point {
    public x = 0;
    public y = 0;

    constructor(x?: number, y?: number) {
        if (x != null) {
            this.x = x;
        }

        if (y != null) {
            this.y = y;
        }
    }

    /**
     * Set the point to specific x and y coordinate.
     */
    public setPoint(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }
}
