export class StrokeStyle {
    public color: string | CanvasGradient | undefined;
    public lineWidth: number | undefined;

    constructor(color?: string | CanvasGradient, lineWidth?: number) {
        this.color = color;
        this.lineWidth = lineWidth;
    }

    public isValid(): boolean {
        return this.color != null && this.color !== 'none';
    }
}
