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
    translate(x: number, y: number);
    scale(x: number, y: number);
    rotate(angle: number);
    saveState();
    restoreState();
    clear();
    clearRect(x: number, y: number, width: number, height: number);
    setFilter(filter: CanvasFilter);
    removeFilter();
    setLineDash(linePx: number, spacePx: number);
    setFillStyle(style: FillStyle);
    setStrokeStyle(style: StrokeStyle);
    setShadowStyle(style: ShadowStyle);
    setFont(font: CanvasFont);
    setTextBaseline(alignment: 'alphabetic' | 'top' | 'hanging' | 'middle' | 'ideographic' | 'bottom');
    setOpacity(value: number);
    setClipRegion(x: number, y: number, width: number, height: number);
    drawRect(x: number, y: number, width: number, height: number, fill?: boolean, stroke?: boolean);
    drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number);
    drawEllipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number);
    drawRoundRect(x: number, y: number, width: number, height: number,
                  radius: number | ICorners, fill: boolean, stroke: boolean);
    drawLine(x: number, y: number, x2: number, y2: number);
    drawText(text: string, x: number, y: number, maxWidth?: number, fill?: boolean, stroke?: boolean);
    drawWrappedText(text: string, x: number, y: number, maxWidth: number, lineHeight: number, fill?: boolean, stroke?: boolean);
    drawImage(image: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
              x: number, y: number, width?: number, height?: number);
    drawScaledImage(image: HTMLImageElement | HTMLCanvasElement | ImageBitmap, x: number, y: number,
                    width: number, height: number, srcX: number, srcY: number, srcWidth: number, srcHeight: number);
    beginPath(): ICanvasPath;
    createLinearGradient(x1: number, y1: number, x2: number, y2: number, colorSteps: IColorStep[]): FillStyle;
    createRadialGradient(x1: number, y1: number, x2: number, y2: number,
                         radiusX: number, radiusY: number, colorSteps: IColorStep[]): FillStyle;
    createPattern(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
                  repetitionStyle: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat');
}
