export interface IColorStep {
    offset: number;
    color: string;
}

export class FillStyle {
    public value: string | CanvasGradient | CanvasPattern;

    public isValid(): boolean {
        return this.value != null && this.value !== 'none';
    }
}
