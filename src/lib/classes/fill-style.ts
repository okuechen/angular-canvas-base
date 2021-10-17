export interface IColorStep {
    offset: number;
    color: string;
}

export class FillStyle {
    public value: string | CanvasGradient | CanvasPattern | undefined;

    constructor(value?: string | CanvasGradient | CanvasPattern) {
        this.value = value;
    }

    public isValid(): boolean {
        return this.value != null && this.value !== 'none';
    }
}
