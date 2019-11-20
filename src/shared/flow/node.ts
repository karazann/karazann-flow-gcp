import { Input, Output } from './io'
import { NodeData, InputsData, OutputsData } from './core/data'

export class Node {
    private static latestId = 0
    private static incrementId(): number {
        if (!this.latestId) this.latestId = 1
        else this.latestId++
        return this.latestId
    }
    
    // Node Data
    public id: number
    public inputs = new Map<string, Input>()
    public outputs = new Map<string, Output>()
    public data: { [key: string]: unknown } = {}
    public position: [number, number] = [0.0, 0.0]

    constructor(public name: string) {
        this.id = Node.incrementId()
    }

    public addInput(input: Input): Node {
        this._add(this.inputs, input, 'node')
        return this
    }

    public removeInput(input: Input): void {
        input.removeConnections()
        input.node = null

        this.inputs.delete(input.key)
    }

    public addOutput(output: Output): Node {
        this._add(this.outputs, output, 'node')
        return this
    }

    public removeOutput(output: Output): void {
        output.removeConnections()
        output.node = null

        this.outputs.delete(output.key)
    }

    public toJSON(): NodeData {
        const reduceIO = <T extends any>(list: Map<string, Input | Output>): T => {
            return Array.from(list).reduce<T>((obj, [key, io]) => {
                obj[key] = io.toJSON()
                return obj
            }, {} as any)
        }

        return {
            id: this.id,
            data: this.data,
            inputs: reduceIO<InputsData>(this.inputs),
            outputs: reduceIO<OutputsData>(this.outputs),
            position: this.position,
            name: this.name
        }
    }

    private _add<T extends any>(list: Map<string, T>, item: T, prop: string): void {
        if (list.has(item.key)) throw new Error(`Item with key '${item.key}' already been added to the node`)
        if (item[prop] !== null) throw new Error('Item has already been added to some node')

        item[prop] = this
        list.set(item.key, item)
    }
}
