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

    public setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public setRect(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public pointInRect(x: number, y: number): boolean {
        if (x >= this.x && x <= this.x + this.width &&
            y >= this.y && y <= this.y + this.height) {
            return true;
        } else {
            return false;
        }
    }
}
