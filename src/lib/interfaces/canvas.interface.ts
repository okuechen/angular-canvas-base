import { FillStyle, IColorStep } from '../classes/fill-style';
import { StrokeStyle } from '../classes/stroke-style';
import { ICanvasPath } from '../interfaces/canvas-path.interface';
import { ShadowStyle } from '../classes/shadow-style';
import { CanvasFilter } from '../classes/canvas-filter';
import { CanvasFont } from '../classes/canvas-font';

export interface ICorners {
    topleft: number;
    topright: number;
    bottomright: number;
    bottomleft: number;
}

export interface ICanvas {
    getDomNode(): HTMLCanvasElement;
    getWidth(): number;
    getHeight(): number;
    translate(x: number, y: number): void;
    scale(x: number, y: number): void;
    rotate(angle: number): void;
    saveState(): void;
    restoreState(): void;
    clear(): void;
    clearRect(x: number, y: number, width: number, height: number): void;
    setFilter(filter: CanvasFilter): void;
    removeFilter(): void;
    setLineDash(linePx: number, spacePx: number): void;
    setFillStyle(style: FillStyle): void;
    setStrokeStyle(style: StrokeStyle): void;
    setShadowStyle(style: ShadowStyle): void;
    setFont(font: CanvasFont): void;
    setTextBaseline(alignment: 'alphabetic' | 'top' | 'hanging' | 'middle' | 'ideographic' | 'bottom'): void;
    setOpacity(value: number): void;
    setClipRegion(x: number, y: number, width: number, height: number): void;
    drawRect(x: number, y: number, width: number, height: number, fill?: boolean, stroke?: boolean): void;
    drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): void;
    drawEllipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number): void;
    drawRoundRect(x: number, y: number, width: number, height: number,
                  radius: number | ICorners, fill: boolean, stroke: boolean): void;
    drawLine(x: number, y: number, x2: number, y2: number): void;
    measureText(text: string): TextMetrics;
    drawText(text: string, x: number, y: number, maxWidth?: number, fill?: boolean, stroke?: boolean): void;
    drawWrappedText(text: string, x: number, y: number, maxWidth: number, lineHeight: number, fill?: boolean, stroke?: boolean): void;
    drawImage(image: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
              x: number, y: number, width?: number, height?: number): void;
    drawScaledImage(image: HTMLImageElement | HTMLCanvasElement | ImageBitmap, x: number, y: number,
                    width: number, height: number, srcX: number, srcY: number, srcWidth: number, srcHeight: number): void;
    beginPath(): ICanvasPath;
    createLinearGradient(x1: number, y1: number, x2: number, y2: number, colorSteps: IColorStep[]): FillStyle;
    createRadialGradient(x1: number, y1: number, x2: number, y2: number,
                         radiusX: number, radiusY: number, colorSteps: IColorStep[]): FillStyle;
    createPattern(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
                  repetitionStyle: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'): void;
}
