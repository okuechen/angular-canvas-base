/**
 * Draw mode of the canvas
 */
export enum CanvasDrawMode {

    /**
     * The canvas will be drawn continuously, trying to draw 60 times a second.
     * Best for animated content.
     */
    Continuous,

    /**
     * Draw only if [[ICanvas]] draw is called. No resources are wasted to draw if nothing happens.
     */
    OnDemand
}
