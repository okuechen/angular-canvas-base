/**
 * Represents one color step for a gradient.
 */
export interface IColorStep {
    offset: number;
    color: string;
}

/**
 * Define the current fill style of the canvas.
 */
export class FillStyle {
    public value: string | CanvasGradient | CanvasPattern | undefined;

    constructor(value?: string | CanvasGradient | CanvasPattern) {
        this.value = value;
    }

    public isValid(): boolean {
        return this.value != null && this.value !== 'none';
    }
}
