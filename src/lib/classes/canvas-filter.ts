export class CanvasFilter {
    private filter = 'none';
    private filterArray: string[] = [];

    public getFilter(): string {
        return this.filter;
    }

    public reset() {
        this.filter = 'none';
        this.filterArray = [];
    }

    public addCustomFilter(value: string) {
        this.addFilter(value);
    }

    public addBlur(length: number) {
        this.addFilter(`blur(${length}px)`);
    }

    public addBrightness(percentage: number) {
        this.addFilter(`brightness(${length}%)`);
    }

    public addContrast(percentage: number) {
        this.addFilter(`contrast(${percentage}%)`);
    }

    public addDropShadow(offsetX: number, offsetY: number, radius: number, color: string) {
        this.addFilter(`drop-shadow(${offsetX}px ${offsetY}px ${radius}px ${color})`);
    }

    public addGrayscale(percentage: number) {
        this.addFilter(`grayscale(${percentage}%)`);
    }

    public hueRotation(degree: number) {
        this.addFilter(`hue-rotate(${degree}deg)`);
    }

    public invert(percentage: number) {
        this.addFilter(`invert(${percentage}%)`);
    }

    public opacity(percentage: number) {
        this.addFilter(`opacity(${percentage}%)`);
    }

    public saturation(percentage: number) {
        this.addFilter(`saturation(${percentage}%)`);
    }

    public sepia(percentage: number) {
        this.addFilter(`sepia(${percentage}%)`);
    }

    private addFilter(filter: string) {
        this.filterArray.push(filter);
        this.filter = this.filterArray.join(' ');
    }
}
