# angular-canvas-base

The angular canvas base was created to simplify creating canvas components for angular. You can add it to your project via NPM.

`npm install angular-canvas-base`

## Examples

Here some examples how to handle the canvas base.

### Create a component that draws a rectangle

```typescript
import { Component, Injector } from '@angular/core';
import { CanvasBaseDirective, ICanvas, Point } from 'angular-canvas-base';

@Component({
    selector: 'my-canvas-component',
    template: ''
})
export class MyCanvasComponent extends CanvasBaseDirective {
    constructor(injector: Injector) {
        super(injector);

        this.resize(200, 200);
    }

    protected onDraw(canvas: ICanvas) {
        canvas.drawRect(10, 10, 180, 180, false, true);
    }
}

```

### Draw a centered label inside a rectangle

```typescript
import { Component, Injector } from '@angular/core';
import { CanvasBaseDirective, CanvasFont, FillStyle, ICanvas, StrokeStyle } from 'angular-canvas-base';

@Component({
    selector: 'my-canvas-component',
    template: ''
})
export class MyCanvasComponent extends CanvasBaseDirective {
    constructor(injector: Injector) {
        super(injector);

        this.resize(200, 200);
    }

    protected onDraw(canvas: ICanvas) {
        canvas.setFillStyle(new FillStyle('#F00'));
        canvas.setStrokeStyle(new StrokeStyle('#888', 4));

        canvas.drawRect(10, 10, 180, 180, true, true);

        canvas.setFont(new CanvasFont(24, 'Arial'));
        canvas.setFillStyle(new FillStyle('#FFF'));
        canvas.setTextBaseline('middle');

        canvas.drawText('Button', 60, 96, 90, true);
    }
}

```

### Draw a simple animation with frame-time and continuous drawing

```typescript
import { Component, Injector } from '@angular/core';
import { CanvasBaseDirective, CanvasDrawMode, FillStyle, ICanvas, StrokeStyle } from 'angular-canvas-base';

@Component({
    selector: 'my-canvas-component',
    template: ''
})
export class MyCanvasComponent extends CanvasBaseDirective {
    private size = 10;
    private direction = 0.2;

    constructor(injector: Injector) {
        super(injector);

        this.setDrawMode(CanvasDrawMode.Continuous);
        this.resize(500, 500);
    }

    protected onDraw(canvas: ICanvas, frameTime: number) {
        canvas.clear();
        canvas.setFillStyle(new FillStyle('#BBB'));
        canvas.setStrokeStyle(new StrokeStyle('#444', 2));

        canvas.drawRect(200 - this.size / 2, 200 - this.size / 2, this.size, this.size, true, true);

        this.size += this.direction * frameTime;

        if (this.size < 10) {
            this.direction = 0.2;
        }

        if (this.size > 200) {
            this.direction = -0.2;
        }
    }
}

```
