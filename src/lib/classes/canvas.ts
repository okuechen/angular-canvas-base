import { CanvasPath } from './canvas-path';
import { ICanvas, ICorners } from '../interfaces/canvas.interface';
import { FillStyle, IColorStep } from './fill-style';
import { StrokeStyle } from './stroke-style';
import { ICanvasPath } from '../interfaces/canvas-path.interface';
import { ShadowStyle } from './shadow-style';
import { CanvasFilter } from './canvas-filter';
import { CanvasFont } from './canvas-font';

export class Canvas implements ICanvas {
    protected pixelRatio = 1;
    protected context: CanvasRenderingContext2D;

    private canvasNode: HTMLCanvasElement;
    private canvasPath: CanvasPath;
    private width = 0;
    private height = 0;

    constructor() {
        this.pixelRatio = window.devicePixelRatio || 1;

        this.canvasNode = document.createElement('canvas');
        this.context = this.canvasNode.getContext('2d') as CanvasRenderingContext2D;
        this.canvasPath = new CanvasPath(this.context, this.pixelRatio);
    }

    public toBase64(): string {
        return this.canvasNode.toDataURL();
    }

    public toBlob(type: string, quality: number): Promise<Blob | null> {
        const promise = new Promise<Blob | null>((resolve, reject) => {
            this.canvasNode.toBlob((blob) => {
                resolve(blob);
            }, type, quality);
        });

        return promise;
    }

    public resizeCanvas(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.canvasNode.width = width * this.pixelRatio;
        this.canvasNode.height = height * this.pixelRatio;
    }

    public getDomNode(): HTMLCanvasElement {
        return this.canvasNode;
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public translate(x: number, y: number): void {
        this.context.translate(x * this.pixelRatio, y * this.pixelRatio);
    }

    public scale(x: number, y: number): void {
        this.context.scale(x, y);
    }

    public rotate(angle: number): void {
        this.context.rotate(angle);
    }

    public saveState(): void {
        this.context.save();
    }

    public restoreState(): void {
        this.context.restore();
    }

    public clear(): void {
        this.context.clearRect(0, 0, this.width * this.pixelRatio, this.height * this.pixelRatio);
    }

    public clearRect(x: number, y: number, width: number, height: number): void {
        this.context.clearRect(x * this.pixelRatio, y * this.pixelRatio, width * this.pixelRatio, height * this.pixelRatio);
    }

    public setFilter(filter: CanvasFilter): void {
        this.context.filter = filter.getFilter();
    }

    public removeFilter(): void {
        this.context.filter = 'none';
    }

    public setLineDash(linePx: number, spacePx: number): void {
        this.context.setLineDash([linePx * this.pixelRatio, spacePx * this.pixelRatio]);
    }

    public setFillStyle(style: FillStyle): void {
        if (style.value) {
            this.context.fillStyle = style.value;
        }
    }

    public setStrokeStyle(style: StrokeStyle): void {
        if (style.color) {
            this.context.strokeStyle = style.color;
        }
        this.context.lineWidth = (style.lineWidth ?? 1) * this.pixelRatio;
    }

    public setShadowStyle(style: ShadowStyle): void {
        if (style) {
            this.context.shadowColor = style.color;
            this.context.shadowBlur = style.blur;
            this.context.shadowOffsetX = style.offsetX * this.pixelRatio;
            this.context.shadowOffsetY = style.offsetY * this.pixelRatio;
        } else {
            this.context.shadowColor = 'rgba(0, 0, 0, 0)';
            this.context.shadowBlur = 0;
            this.context.shadowOffsetX = 0;
            this.context.shadowOffsetY = 0;
        }
    }

    public setFont(font: CanvasFont): void {
        this.context.font = `${font.fontStyle} ${font.fontWeight} ${font.fontSize * this.pixelRatio}px ${font.fontFamily}`;
    }

    public setTextBaseline(alignment: 'alphabetic' | 'top' | 'hanging' | 'middle' | 'ideographic' | 'bottom'): void {
        this.context.textBaseline = alignment;
    }

    public setOpacity(value: number): void {
        this.context.globalAlpha = value;
    }

    public setClipRegion(x: number, y: number, width: number, height: number): void {
        this.context.beginPath();
        this.context.rect(x * this.pixelRatio, y * this.pixelRatio, width * this.pixelRatio, height * this.pixelRatio);
        this.context.closePath();
        this.context.clip();
    }

    public drawRect(x: number, y: number, width: number, height: number, fill?: boolean, stroke?: boolean): void {
        if (fill === true) {
            this.context.fillRect(x * this.pixelRatio, y * this.pixelRatio, width * this.pixelRatio, height * this.pixelRatio);
        }

        if (stroke === true) {
            this.context.strokeRect(x * this.pixelRatio, y * this.pixelRatio, width * this.pixelRatio, height * this.pixelRatio);
        }
    }

    public drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): void {
        this.context.arc(x * this.pixelRatio, y * this.pixelRatio, radius, startAngle, endAngle);
    }

    public drawEllipse(x: number, y: number, radiusX: number, radiusY: number,
                       rotation: number, startAngle: number, endAngle: number): void {
        this.context.ellipse(x * this.pixelRatio, y * this.pixelRatio, radiusX, radiusY, rotation, startAngle, endAngle);
    }

    public drawRoundRect(x: number, y: number, width: number, height: number,
                         radius: number | ICorners, fill: boolean, stroke: boolean): void {

        let borderRadius: ICorners;
        if (typeof(radius) === 'number') {
            borderRadius = {
                bottomleft: radius,
                bottomright: radius,
                topleft: radius,
                topright: radius
            };
        } else {
            borderRadius = radius;
        }

        this.beginPath()
            .moveTo(x + borderRadius.topleft, y)
            .lineTo(x + width - borderRadius.topright, y)
            .quadraticCurveTo(x + width, y, x + width, y + borderRadius.topright)
            .lineTo(x + width, y + height - borderRadius.bottomright)
            .quadraticCurveTo(x + width, y + height, x + width - borderRadius.bottomright, y + height)
            .lineTo(x + borderRadius.bottomleft, y + height)
            .quadraticCurveTo(x, y + height, x, y + height - borderRadius.bottomleft)
            .lineTo(x, y + borderRadius.topleft)
            .quadraticCurveTo(x, y, x + borderRadius.topleft, y)
            .close(fill, stroke);
    }

    public drawLine(x: number, y: number, x2: number, y2: number): void {
        this.context.beginPath();
        this.context.moveTo(x * this.pixelRatio, y * this.pixelRatio);
        this.context.lineTo(x2 * this.pixelRatio, y2 * this.pixelRatio);
        this.context.closePath();
        this.context.stroke();
    }

    public drawText(text: string, x: number, y: number, maxWidth?: number, fill?: boolean, stroke?: boolean): void {
        if (fill !== false) {
            if (maxWidth == null) {
                this.context.fillText(text, x * this.pixelRatio, y * this.pixelRatio);
            } else {
                this.context.fillText(text, x * this.pixelRatio, y * this.pixelRatio,
                    maxWidth * this.pixelRatio);
            }
        }

        if (stroke === true) {
            if (maxWidth == null) {
                this.context.strokeText(text, x * this.pixelRatio, y * this.pixelRatio);
            } else {
                this.context.strokeText(text, x * this.pixelRatio, y * this.pixelRatio,
                    maxWidth * this.pixelRatio);
            }
        }
    }

    public drawWrappedText(text: string, x: number, y: number, maxWidth: number,
                           lineHeight: number, fill?: boolean, stroke?: boolean): void {
        const words = text.split(' ');
        let line = '';

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = this.context.measureText(testLine);
            const testWidth = metrics.width;

            if (testWidth > x + maxWidth && n > 0) {
                this.drawText(line, x, y, undefined, fill, stroke);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }

        this.drawText(line, x, y, undefined, fill, stroke);
    }

    public drawImage(image: HTMLImageElement | HTMLCanvasElement | ImageBitmap | ICanvas,
                     x: number, y: number, width?: number, height?: number): void {
        if (image instanceof Canvas) {
            this.context.drawImage(image.getDomNode(), x * this.pixelRatio, y * this.pixelRatio,
                (width != null) ? (width * this.pixelRatio) : (image.width * this.pixelRatio),
                (height != null) ? (height * this.pixelRatio) : (image.height * this.pixelRatio));
        } else if (image instanceof HTMLImageElement) {
            this.context.drawImage(image as HTMLImageElement, x * this.pixelRatio, y * this.pixelRatio,
                (width != null) ? (width * this.pixelRatio) : (image.width * this.pixelRatio),
                (height != null) ? (height * this.pixelRatio) : (image.height * this.pixelRatio));
        }
    }

    public drawScaledImage(image: HTMLImageElement | HTMLCanvasElement | ImageBitmap | ICanvas,
                           x: number, y: number, width: number, height: number,
                           srcX: number, srcY: number, srcWidth: number, srcHeight: number): void {
        if (image instanceof Canvas) {
            this.context.drawImage(image.getDomNode(), srcX, srcY, srcWidth, srcHeight,
                x * this.pixelRatio, y * this.pixelRatio, width * this.pixelRatio, height * this.pixelRatio);
        } else {
            this.context.drawImage(image as HTMLImageElement, srcX, srcY, srcWidth, srcHeight,
                x * this.pixelRatio, y * this.pixelRatio, width * this.pixelRatio, height * this.pixelRatio);
        }
    }

    public beginPath(): ICanvasPath {
        this.canvasPath.begin();
        return this.canvasPath;
    }

    public createLinearGradient(x1: number, y1: number, x2: number, y2: number, colorSteps: IColorStep[]): FillStyle {
        const gradient: CanvasGradient = this.context.createLinearGradient(x1 * this.pixelRatio,
            y1 * this.pixelRatio, x2 * this.pixelRatio, y2 * this.pixelRatio);

        // tslint:disable-next-line: prefer-for-of
        for (let n = 0; n < colorSteps.length; n ++) {
            gradient.addColorStop(colorSteps[n].offset, colorSteps[n].color);
        }

        const fillStyle: FillStyle = new FillStyle();
        fillStyle.value = gradient;
        return fillStyle;
    }

    public createRadialGradient(x1: number, y1: number, x2: number, y2: number,
                                radiusX: number, radiusY: number, colorSteps: IColorStep[]): FillStyle {
        const gradient: CanvasGradient = this.context.createRadialGradient(x1 * this.pixelRatio,
            y1 * this.pixelRatio, radiusX, x2 * this.pixelRatio, y2 * this.pixelRatio, radiusY);

        // tslint:disable-next-line: prefer-for-of
        for (let n = 0; n < colorSteps.length; n ++) {
            gradient.addColorStop(colorSteps[n].offset, colorSteps[n].color);
        }

        const fillStyle: FillStyle = new FillStyle();
        fillStyle.value = gradient;
        return fillStyle;
    }

    public createPattern(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ICanvas,
                         repetitionStyle: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'): FillStyle {
        let pattern: CanvasPattern | null = null;
        if (image instanceof Canvas) {
            pattern = this.context.createPattern(image.getDomNode(), repetitionStyle);
        } else {
            pattern = this.context.createPattern(image as HTMLImageElement, repetitionStyle);
        }

        const fillStyle: FillStyle = new FillStyle();
        if (pattern) {
            fillStyle.value = pattern;
        }
        return fillStyle;
    }

    /**
     * Helper methods
     */
    protected roundNumber(value: number, decimals: number): number {
        return Number(Number(value).toFixed(decimals));
    }
}
