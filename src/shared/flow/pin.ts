export class Pin {
    constructor(private name: string, private compatible: Pin[] = [], private data = {}) {}

    public combineWith(pin: Pin): void {
        this.compatible.push(pin)
    }

    public compatibleWith(pin: Pin): boolean {
        return this === pin || this.compatible.includes(pin)
    }
}
