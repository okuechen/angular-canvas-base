/**
 * Representing a font that can be set in an ICanvas to render text. Values are similar to css.
 */
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
