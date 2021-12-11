/**
 * An instance of this class can be passed to an [[ICanvas]] to draw with an active filter.
 * Many effects / filter can be used parallel, simply add the ones you want with following functions.
 */
export class CanvasFilter {
    private filter = 'none';
    private filterArray: string[] = [];

    /**
     * Get the filter as string.
     */
    public getFilter(): string {
        return this.filter;
    }

    /**
     * Reset the filter to none.
     */
    public reset(): void {
        this.filter = 'none';
        this.filterArray = [];
    }

    /**
     * Add a custom filter to the filter query.
     */
    public addCustomFilter(value: string): void {
        this.addFilter(value);
    }

    /**
     * Add blur effect with length in pixel.
     */
    public addBlur(length: number): void {
        this.addFilter(`blur(${length}px)`);
    }

    /**
     * Add a brightness with percentage.
     */
    public addBrightness(percentage: number): void {
        this.addFilter(`brightness(${length}%)`);
    }

    /**
     * Add a contract filter with percentage.
     */
    public addContrast(percentage: number): void {
        this.addFilter(`contrast(${percentage}%)`);
    }

    /**
     * Add a drop shadow, all parameter in pixel except color.
     */
    public addDropShadow(offsetX: number, offsetY: number, radius: number, color: string): void {
        this.addFilter(`drop-shadow(${offsetX}px ${offsetY}px ${radius}px ${color})`);
    }

    /**
     * Add a grayscale with percentage.
     */
    public addGrayscale(percentage: number): void {
        this.addFilter(`grayscale(${percentage}%)`);
    }

    /**
     * Add a hue rotation with degree.
     */
    public hueRotation(degree: number): void {
        this.addFilter(`hue-rotate(${degree}deg)`);
    }

    /**
     * Invert with percentage.
     */
    public invert(percentage: number): void {
        this.addFilter(`invert(${percentage}%)`);
    }

    /**
     * Add an opacity with percentage.
     */
    public opacity(percentage: number): void {
        this.addFilter(`opacity(${percentage}%)`);
    }

    /**
     * Add saturation with percentage.
     */
    public saturation(percentage: number): void {
        this.addFilter(`saturation(${percentage}%)`);
    }

    /**
     * Add a sepia effect with percentage.
     */
    public sepia(percentage: number): void {
        this.addFilter(`sepia(${percentage}%)`);
    }

    private addFilter(filter: string): void {
        this.filterArray.push(filter);
        this.filter = this.filterArray.join(' ');
    }
}
