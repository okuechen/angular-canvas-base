export class CanvasFont {
    public fontStyle: 'normal' | 'italic' = 'normal';
    public fontWeight: number | 'normal' | 'bold' | 'bolder' | 'lighter' = 'normal';
    public fontSize: number;
    public fontFamily: string;

    constructor(fontSize?: number, fontFamily?: string) {
        this.fontSize = fontSize ?? 13;
        this.fontFamily = fontFamily ?? 'Arial';
    }
}
