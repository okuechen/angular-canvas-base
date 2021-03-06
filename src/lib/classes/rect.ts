/**
 * A rectangle with x and y as start points inside the canvas, and width / height to define the size.
 */
export class Rect {
    public x = 0;
    public y = 0;
    public width = 0;
    public height = 0;

    constructor(x?: number, y?: number, width?: number, height?: number) {
        if (x != null) {
            this.x = x;
        }

        if (y != null) {
            this.y = y;
        }

        if (width != null) {
            this.width = width;
        }

        if (height != null) {
            this.height = height;
        }
    }

    /**
     * Set the position of the rectangle in pixel.
     */
    public setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    /**
     * Set the entire rect.
     */
    public setRect(x: number, y: number, width: number, height: number): void {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * Check if a coordinate is inside the rectangle.
     */
    public pointInRect(x: number, y: number): boolean {
        if (x >= this.x && x <= this.x + this.width &&
            y >= this.y && y <= this.y + this.height) {
            return true;
        } else {
            return false;
        }
    }
}
