import { OnDestroy, Renderer2, AfterViewInit, ElementRef, Injector, Directive } from '@angular/core';

import { CanvasDrawMode } from './enums/canvas-draw-mode.enum';
import { Canvas } from './classes/canvas';
import { ICanvas } from './interfaces/canvas.interface';
import { Point } from './classes/point';

@Directive()
export abstract class CanvasBaseDirective implements OnDestroy, AfterViewInit {
    protected height = 0;
    protected width = 0;
    protected drawMode: CanvasDrawMode = CanvasDrawMode.OnDemand;
    protected clearOnDraw = true;

    private dragAndDropEnabled = false;
    private dragging = false;
    private dragStartPosition: Point = new Point();
    private dragMaxDistance = 15;
    private dragStartTimeout = 300;
    private dragStartTimeoutHandle: number | null = null;

    private inDrawingLoop = false;
    private currentFrameRequestID: number | null = null;
    private lastTime = 0;
    private disposed = false;

    private canvas: Canvas;
    protected elementRef: ElementRef;
    protected renderer: Renderer2;

    constructor(protected injector: Injector) {
        this.elementRef = injector.get(ElementRef);
        this.renderer = injector.get(Renderer2);

        this.canvas = new Canvas();
        this.canvas.resizeCanvas(0, 0);
    }

    public ngAfterViewInit(): void {
        this.attachCanvas(this.elementRef.nativeElement);

        this.renderer.listen(this.getCanvasNode(), 'click', (event) => {
            this.eventClick(event);
        });
    }

    public ngOnDestroy(): void {
        this.disposed = true;
    }

    private attachCanvas(parent: HTMLElement): void {
        parent.appendChild(this.canvas.getDomNode());
    }

    public toBase64(): string {
        return this.canvas.toBase64();
    }

    public toBlob(type: string = 'image/png', quality: number = 99): Promise<Blob | null> {
        return this.canvas.toBlob(type, quality);
    }

    public getCanvas(): ICanvas {
        return this.canvas;
    }

    public resize(width: number, height: number): void {
        this.width = width;
        this.height = height;

        this.canvas.resizeCanvas(width, height);

        this.eventResize(width, height);
        this.draw();
    }

    protected getCanvasNode(): HTMLElement {
        return this.canvas.getDomNode();
    }

    protected startDrawing(): void {
        if (this.clearOnDraw) {
            this.canvas.clear();
        }

        // sharpness fix
        this.canvas.saveState();
        this.canvas.translate(0.5, 0.5);

        this.onDraw(this.canvas, this.getTimeDelta());

        this.canvas.restoreState();
    }

    protected createOffscreenBuffer(width: number, height: number): ICanvas {
        const buffer: Canvas = new Canvas();
        buffer.resizeCanvas(width, height);
        return buffer;
    }

    public draw(): void {
        if (this.inDrawingLoop || this.currentFrameRequestID != null) {
            return;
        } else {
            this.requestDraw();
        }
    }

    public setDrawMode(drawMode: CanvasDrawMode): void {
        this.drawMode = drawMode;
        this.draw();
    }

    public isDragAndDropEnabled(): boolean {
        return this.dragAndDropEnabled;
    }

    public enableDragAndDrop(enable: boolean): void {
        this.dragAndDropEnabled = enable;

        if (enable) {
            this.renderer.listen(this.getCanvasNode(), 'mouseup', (event) => {
                this.mouseUp(event);
            });

            this.renderer.listen(this.getCanvasNode(), 'mousedown', (event) => {
                this.mouseDown(event);
            });

            this.renderer.listen(this.getCanvasNode(), 'mousemove', (event) => {
                this.mouseMove(event);
            });
        }
    }

    protected abstract onDraw(canvas: ICanvas, deltaTime?: number): void;

    // Overridables
    protected eventResize(width: number, height: number): void {}

    protected eventDrag(event: PointerEvent): boolean { return false; }
    protected eventDragMove(event: PointerEvent): void {}
    protected eventDrop(event: PointerEvent, startPosition: Point): void {}

    protected eventClick(event: PointerEvent): void {}
    protected eventPointerMove(event: PointerEvent): void {}
    protected eventPointerUp(event: PointerEvent): void {}
    protected eventPointerDown(event: PointerEvent): void {}

    protected getTime(): number {
        return window.performance.now();
    }

    protected getTimeDelta(): number {
        if (this.lastTime == null) {
            this.lastTime = this.getTime();
        }

        const delta = this.getTime() - this.lastTime;
        this.lastTime = this.getTime();
        return delta;
    }

    protected getDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.hypot(x2 - x1, y2 - y1);
    }

    private requestDraw(): void {
        this.currentFrameRequestID = requestAnimationFrame(() => {
            this.currentFrameRequestID = null;
            this.startDrawing();

            if (this.drawMode === CanvasDrawMode.Continuous && !this.disposed) {
                this.inDrawingLoop = true;
                window.setTimeout(() => {
                    this.requestDraw();
                }, 10);
            } else {
                this.inDrawingLoop = false;
            }
        });
    }

    private mouseUp(event: PointerEvent): void {
        if (this.dragStartTimeoutHandle) {
            window.clearTimeout(this.dragStartTimeoutHandle);
            this.dragStartTimeoutHandle = null;
        }

        if (this.dragging) {
            this.eventDrop(event, this.dragStartPosition);
            this.dragging = false;
        }

        this.eventPointerUp(event);
    }

    private mouseMove(event: PointerEvent): void {
        if (this.dragStartTimeoutHandle) {
            if (this.getDistance(this.dragStartPosition.x, this.dragStartPosition.y, event.offsetX, event.offsetY) > this.dragMaxDistance) {
                window.clearTimeout(this.dragStartTimeoutHandle);
                this.dragStartTimeoutHandle = null;
            }
        }

        if (this.dragging) {
            this.eventDragMove(event);
        }

        this.eventPointerMove(event);
    }

    private mouseDown(event: PointerEvent): void {
        this.dragStartPosition.setPoint(event.offsetX, event.offsetY);
        this.dragStartTimeoutHandle = window.setTimeout(() => {
            this.dragStartTimeoutHandle = null;
            this.dragging = this.eventDrag(event);
        }, this.dragStartTimeout);

        this.eventPointerDown(event);
    }
}
