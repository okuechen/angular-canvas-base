import { ICanvasPath } from '../interfaces/canvas-path.interface';

export class CanvasPath implements ICanvasPath {
    protected pathOpen = false;

    constructor(protected context: CanvasRenderingContext2D,
                protected pixelRatio: number) {
    }

    public isPathOpen(): boolean {
        return this.pathOpen;
    }

    public begin() {
        if (this.pathOpen) {
            return;
        }

        this.pathOpen = true;
        this.context.beginPath();
    }

    public arcTo(x: number, y: number, x2: number, y2: number, radius: number): ICanvasPath {
        this.context.arcTo(x * this.pixelRatio, y * this.pixelRatio, x2 * this.pixelRatio, y2 * this.pixelRatio, radius * this.pixelRatio);
        return this;
    }

    public moveTo(x: number, y: number): ICanvasPath {
        this.context.moveTo(x * this.pixelRatio, y * this.pixelRatio);
        return this;
    }

    public lineTo(x: number, y: number): ICanvasPath {
        this.context.lineTo(x * this.pixelRatio, y * this.pixelRatio);
        return this;
    }

    public quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): ICanvasPath {
        this.context.quadraticCurveTo(cpx * this.pixelRatio, cpy * this.pixelRatio, x * this.pixelRatio, y * this.pixelRatio);
        return this;
    }

    public close(fill: boolean, stroke: boolean) {
        this.context.closePath();
        this.pathOpen = false;

        if (fill) {
            this.context.fill();
        }

        if (stroke) {
            this.context.stroke();
        }
    }
}
