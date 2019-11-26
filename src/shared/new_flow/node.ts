import { Input, Output } from './io'

interface IOData {
    data: any
}

export interface IOutputsData {
    [key: string]: IOData
}

export interface IInputsData {
    [key: string]: IOData
}

export interface IFlowControls {
    [key: string]: () => void | Promise<void>
}

export class Node {
    private static latestId = 0

    private static incrementId(): number {
        if (!this.latestId) this.latestId = 1
        else this.latestId++
        return this.latestId
    }

    // new datas

    builderName!: string
    processed: boolean = false

    id!: number
    inputs = new Map<string, Input>()
    outputs = new Map<string, Output>()

    outputDatas: IOutputsData = {}

    constructor() {
        this.id = Node.incrementId()
    }

    addInput(input: Input): Node {
        this._add(this.inputs, input, 'node')
        return this
    }

    removeInput(input: Input): void {
        input.removeConnections()
        input.node = null

        this.inputs.delete(input.key)
    }

    addOutput(output: Output): Node {
        this._add(this.outputs, output, 'node')
        return this
    }

    removeOutput(output: Output): void {
        output.removeConnections()
        output.node = null

        this.outputs.delete(output.key)
    }

    private _add<T extends any>(list: Map<string, T>, item: T, prop: string): void {
        if (list.has(item.key)) throw new Error(`Item with key '${item.key}' already been added to the node`)
        if (item[prop] !== null) throw new Error('Item has already been added to some node')

        item[prop] = this
        list.set(item.key, item)
    }
}
