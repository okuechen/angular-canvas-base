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
    protected context: CanvasRenderingContext2D = null;
    private canvasNode: HTMLCanvasElement  = null;
    private canvasPath: CanvasPath = null;
    private width = 0;
    private height = 0;

    constructor() {
        this.pixelRatio = window.devicePixelRatio || 1;

        this.canvasNode = document.createElement('canvas');
        this.context = this.canvasNode.getContext('2d');

        this.canvasPath = new CanvasPath(this.context, this.pixelRatio);
    }

    public toBase64(): string {
        return this.canvasNode.toDataURL();
    }

    public toBlob(type: string = 'image/png', quality: number = 1): Promise<Blob> {
        const promise = new Promise<Blob>((resolve, reject) => {
            this.canvasNode.toBlob((blob: Blob) => {
                resolve(blob);
            }, type, quality);
        });

        return promise;
    }

    public resizeCanvas(width: number, height: number) {
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

    public translate(x: number, y: number) {
        this.context.translate(x * this.pixelRatio, y * this.pixelRatio);
    }

    public scale(x: number, y: number) {
        this.context.scale(x, y);
    }

    public rotate(angle: number) {
        this.context.rotate(angle);
    }

    public saveState() {
        this.context.save();
    }

    public restoreState() {
        this.context.restore();
    }

    public clear() {
        this.context.clearRect(0, 0, this.width * this.pixelRatio, this.height * this.pixelRatio);
    }

    public clearRect(x: number, y: number, width: number, height: number) {
        this.context.clearRect(x * this.pixelRatio, y * this.pixelRatio, width * this.pixelRatio, height * this.pixelRatio);
    }

    public setFilter(filter: CanvasFilter) {
        this.context['filter'] = filter.getFilter();
    }

    public removeFilter() {
        this.context['filter'] = 'none';
    }

    public setLineDash(linePx: number, spacePx: number) {
        this.context.setLineDash([linePx * this.pixelRatio, spacePx * this.pixelRatio]);
    }

    public setFillStyle(style: FillStyle) {
        this.context.fillStyle = style.value;
    }

    public setStrokeStyle(style: StrokeStyle) {
        this.context.strokeStyle = style.color;
        this.context.lineWidth = style.lineWidth * this.pixelRatio;
    }

    public setShadowStyle(style: ShadowStyle) {
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

    public setFont(font: CanvasFont) {
        this.context.font = `${font.fontStyle} ${font.fontWeight} ${font.fontSize * this.pixelRatio}px ${font.fontFamily}`;
    }

    public setTextBaseline(alignment: 'alphabetic' | 'top' | 'hanging' | 'middle' | 'ideographic' | 'bottom') {
        this.context.textBaseline = alignment;
    }

    public setOpacity(value: number) {
        this.context.globalAlpha = value;
    }

    public setClipRegion(x: number, y: number, width: number, height: number) {
        this.context.beginPath();
        this.context.rect(x * this.pixelRatio, y * this.pixelRatio, width * this.pixelRatio, height * this.pixelRatio);
        this.context.closePath();
        this.context.clip();
    }

    public drawRect(x: number, y: number, width: number, height: number, fill?: boolean, stroke?: boolean) {
        if (fill === true) {
            this.context.fillRect(x * this.pixelRatio, y * this.pixelRatio, width * this.pixelRatio, height * this.pixelRatio);
        }

        if (stroke === true) {
            this.context.strokeRect(x * this.pixelRatio, y * this.pixelRatio, width * this.pixelRatio, height * this.pixelRatio);
        }
    }

    public drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
        this.context.arc(x * this.pixelRatio, y * this.pixelRatio, radius, startAngle, endAngle);
    }

    public drawEllipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number) {
        this.context.ellipse(x * this.pixelRatio, y * this.pixelRatio, radiusX, radiusY, rotation, startAngle, endAngle);
    }

    public drawRoundRect(x: number, y: number, width: number, height: number,
                         radius: number | ICorners, fill: boolean, stroke: boolean) {

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

    public drawLine(x: number, y: number, x2: number, y2: number) {
        this.context.beginPath();
        this.context.moveTo(x * this.pixelRatio, y * this.pixelRatio);
        this.context.lineTo(x2 * this.pixelRatio, y2 * this.pixelRatio);
        this.context.closePath();
        this.context.stroke();
    }

    public drawText(text: string, x: number, y: number, maxWidth?: number, fill?: boolean, stroke?: boolean) {
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

    public drawWrappedText(text: string, x: number, y: number, maxWidth: number, lineHeight: number, fill?: boolean, stroke?: boolean) {
        const words = text.split(' ');
        let line = '';

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = this.context.measureText(testLine);
            const testWidth = metrics.width;

            if (testWidth > x + maxWidth && n > 0) {
                this.drawText(line, x, y, null, fill, stroke);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }

        this.drawText(line, x, y, null, fill, stroke);
    }

    public drawImage(image: HTMLImageElement | HTMLCanvasElement | ImageBitmap | ICanvas,
                     x: number, y: number, width?: number, height?: number) {
        if (image instanceof Canvas) {
            this.context.drawImage(image.getDomNode(), x * this.pixelRatio, y * this.pixelRatio,
                (width != null) ? (width * this.pixelRatio) : (image.width * this.pixelRatio),
                (height != null) ? (height * this.pixelRatio) : (image.height * this.pixelRatio));
        } else if (image instanceof HTMLImageElement) {
            this.context.drawImage(<HTMLImageElement>image, x * this.pixelRatio, y * this.pixelRatio,
                (width != null) ? (width * this.pixelRatio) : (image.width * this.pixelRatio),
                (height != null) ? (height * this.pixelRatio) : (image.height * this.pixelRatio));
        }
    }

    public drawScaledImage(image: HTMLImageElement | HTMLCanvasElement | ImageBitmap | ICanvas,
                           x: number, y: number, width: number, height: number, srcX: number, srcY: number, srcWidth: number, srcHeight: number) {
        if (image instanceof Canvas) {
            this.context.drawImage(image.getDomNode(), srcX, srcY, srcWidth, srcHeight,
                x * this.pixelRatio, y * this.pixelRatio, width * this.pixelRatio, height * this.pixelRatio);
        } else {
            this.context.drawImage(<HTMLImageElement>image, srcX, srcY, srcWidth, srcHeight,
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

        for (let n = 0; n < colorSteps.length; n ++) {
            gradient.addColorStop(colorSteps[n].offset, colorSteps[n].color);
        }

        const fillStyle: FillStyle = new FillStyle();
        fillStyle.value = gradient;
        return fillStyle;
    }

    public createPattern(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ICanvas,
                         repetitionStyle: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat') {
        let pattern: CanvasPattern = null;
        if (image instanceof Canvas) {
            pattern = this.context.createPattern(image.getDomNode(), repetitionStyle);
        } else {
            pattern = this.context.createPattern(<HTMLImageElement>image, repetitionStyle);
        }

        const fillStyle: FillStyle = new FillStyle();
        fillStyle.value = pattern;
        return fillStyle;
    }

    /**
     * Helper methods
     */
    protected roundNumber(value: number, decimals: number) {
        return Number(Number(value).toFixed(decimals));
    }
}
