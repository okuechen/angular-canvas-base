export class CanvasFilter {
    private filter = 'none';
    private filterArray: string[] = [];

    public getFilter(): string {
        return this.filter;
    }

    public reset(): void {
        this.filter = 'none';
        this.filterArray = [];
    }

    public addCustomFilter(value: string): void {
        this.addFilter(value);
    }

    public addBlur(length: number): void {
        this.addFilter(`blur(${length}px)`);
    }

    public addBrightness(percentage: number): void {
        this.addFilter(`brightness(${length}%)`);
    }

    public addContrast(percentage: number): void {
        this.addFilter(`contrast(${percentage}%)`);
    }

    public addDropShadow(offsetX: number, offsetY: number, radius: number, color: string): void {
        this.addFilter(`drop-shadow(${offsetX}px ${offsetY}px ${radius}px ${color})`);
    }

    public addGrayscale(percentage: number): void {
        this.addFilter(`grayscale(${percentage}%)`);
    }

    public hueRotation(degree: number): void {
        this.addFilter(`hue-rotate(${degree}deg)`);
    }

    public invert(percentage: number): void {
        this.addFilter(`invert(${percentage}%)`);
    }

    public opacity(percentage: number): void {
        this.addFilter(`opacity(${percentage}%)`);
    }

    public saturation(percentage: number): void {
        this.addFilter(`saturation(${percentage}%)`);
    }

    public sepia(percentage: number): void {
        this.addFilter(`sepia(${percentage}%)`);
    }

    private addFilter(filter: string): void {
        this.filterArray.push(filter);
        this.filter = this.filterArray.join(' ');
    }
}
