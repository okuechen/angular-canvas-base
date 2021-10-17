export interface ICanvasPath {
    isPathOpen(): boolean;

    moveTo(x: number, y: number): ICanvasPath;
    lineTo(x: number, y: number): ICanvasPath;
    quadraticCurveTo(x: number, y: number, x2: number, y2: number): ICanvasPath;
    arcTo(x: number, y: number, x2: number, y2: number, radius: number): ICanvasPath;

    close(fill: boolean, stroke: boolean): void;
}
