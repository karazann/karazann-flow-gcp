export class Pin {
    constructor(private name: string, private compatible: Pin[] = [], private data = {}) {}

    combineWith(pin: Pin): void {
        this.compatible.push(pin)
    }

    compatibleWith(pin: Pin): boolean {
        return this === pin || this.compatible.includes(pin)
    }
}
