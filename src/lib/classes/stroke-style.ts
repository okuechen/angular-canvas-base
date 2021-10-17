export class StrokeStyle {
    public color: string | CanvasGradient;
    public lineWidth: number;

    public isValid(): boolean {
        return this.color != null && this.color !== 'none';
    }
}
