import { OnDestroy, Renderer2, AfterViewInit, Component, ViewChild, ElementRef, Injector } from '@angular/core';

import { CanvasDrawMode } from './enums/canvas-draw-mode.enum';
import { Canvas } from './classes/canvas';
import { ICanvas } from './interfaces/canvas.interface';
import { Point } from './classes/point';

@Component({
    selector: 'canvas-base',
    template: ''
})
export abstract class CanvasBaseComponent implements OnDestroy, AfterViewInit {
    protected height: number;
    protected width: number;
    protected drawMode: CanvasDrawMode = CanvasDrawMode.OnDemand;
    protected clearOnDraw = true;

    private dragAndDropEnabled = false;
    private dragging = false;
    private dragStartPosition: Point = new Point();
    private dragMaxDistance = 15;
    private dragStartTimeout = 300;
    private dragStartTimeoutHandle: number = null;

    private inDrawingLoop = false;
    private currentFrameRequestID: number = null;
    private lastTime: number = null;
    private disposed = false;

    private canvas: Canvas = null;
    protected elementRef: ElementRef;
    protected renderer: Renderer2;

    constructor(protected injector: Injector) {
        this.elementRef = injector.get(ElementRef);
        this.renderer = injector.get(Renderer2);

        this.canvas = new Canvas();
        this.canvas.resizeCanvas(0, 0);
    }

    public ngAfterViewInit() {
        this.attachCanvas(this.elementRef.nativeElement);

        this.renderer.listen(this.getCanvasNode(), 'click', (event) => {
            this.eventClick(event);
        });
    }

    public ngOnDestroy() {
        this.disposed = true;
    }

    private attachCanvas(parent: HTMLElement) {
        parent.appendChild(this.canvas.getDomNode());
    }

    public toBase64(): string {
        return this.canvas.toBase64();
    }

    public toBlob(type: string = 'image/png', quality: number = 99): Promise<Blob> {
        return this.canvas.toBlob(type, quality);
    }

    public getCanvas(): ICanvas {
        return this.canvas;
    }

    public resize(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.canvas.resizeCanvas(width, height);

        this.eventResize(width, height);
        this.draw();
    }

    protected getCanvasNode(): HTMLElement {
        return this.canvas.getDomNode();
    }

    protected startDrawing() {
        if (this.clearOnDraw) {
            this.canvas.clear();
        }

        this.onFrameUpdate(this.getTimeDelta());

        // sharpness fix
        this.canvas.saveState();
        this.canvas.translate(0.5, 0.5);

        this.onDraw(this.canvas);

        this.canvas.restoreState();
    }

    protected createOffscreenBuffer(width: number, height: number): ICanvas {
        const buffer: Canvas = new Canvas();
        buffer.resizeCanvas(width, height);
        return buffer;
    }

    public draw() {
        if (this.inDrawingLoop || this.currentFrameRequestID != null) {
            return;
        } else {
            this.requestDraw();
        }
    }

    public setDrawMode(drawMode: CanvasDrawMode) {
        this.drawMode = drawMode;
        this.draw();
    }

    public isDragAndDropEnabled(): boolean {
        return this.dragAndDropEnabled;
    }

    public enableDragAndDrop(enable: boolean) {
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

    protected abstract onDraw(canvas: ICanvas);
    protected abstract onFrameUpdate(deltaTime: number);

    protected abstract eventResize(width: number, height: number);
    protected abstract eventClick(event: PointerEvent);
    protected abstract eventDrag(event: PointerEvent): boolean;
    protected abstract eventDragMove(event: PointerEvent);
    protected abstract eventDrop(event: PointerEvent, startPosition: Point);

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

    private requestDraw() {
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

    private mouseUp(event: PointerEvent) {
        if (this.dragStartTimeoutHandle) {
            window.clearTimeout(this.dragStartTimeoutHandle);
            this.dragStartTimeoutHandle = null;
            return;
        }

        if (this.dragging) {
            this.eventDrop(event, this.dragStartPosition);
            this.dragging = false;
        }
    }

    private mouseMove(event: PointerEvent) {
        if (this.dragStartTimeoutHandle) {
            if (this.getDistance(this.dragStartPosition.x, this.dragStartPosition.y, event.offsetX, event.offsetY) > this.dragMaxDistance) {
                window.clearTimeout(this.dragStartTimeoutHandle);
                this.dragStartTimeoutHandle = null;
                return;
            }
        }

        if (this.dragging) {
            this.eventDragMove(event);
        }
    }

    private mouseDown(event: PointerEvent) {
        this.dragStartPosition.setPoint(event.offsetX, event.offsetY);
        this.dragStartTimeoutHandle = window.setTimeout(() => {
            this.dragStartTimeoutHandle = null;
            this.dragging = this.eventDrag(event);
        }, this.dragStartTimeout);
    }
}
