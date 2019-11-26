/*!
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

export const enum PinType { 
    Flow,
    Data
}

export class Pin {
    constructor(private name: string, public type: PinType, private compatible: Pin[] = [], private data = {}) {}

    combineWith(pin: Pin): void {
        this.compatible.push(pin)
    }

    isFlow() { 
        return this.type === PinType.Flow
    }

    compatibleWith(pin: Pin): boolean {
        return this === pin || this.compatible.includes(pin)
    }
}
