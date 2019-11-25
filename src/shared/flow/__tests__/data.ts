/*!
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import { NodeBuilder, Node, Output, Pin } from '../index'
import { INodeData, IWorkerInputs } from '../core/data'

const numberPin = new Pin('Number')
const flowPin = new Pin('Flow')

export class Builder1 extends NodeBuilder {
    constructor() {
        super('Builder1')
        this.task = {
            outputs: {
                act: 'flow',
                key: 'data'
            }
        }
    }

    async build(node: Node): Promise<void> {
        node.addOutput(new Output('act', 'On Time', flowPin))
        node.addOutput(new Output('key', 'Key code', numberPin))
    }

    worker(node: INodeData, inputs: IWorkerInputs, data: any): any {
        console.debug()
    }
}

export class Builder2 extends NodeBuilder {
    constructor() {
        super('Builder2')
        this.task = {
            outputs: {
                act: 'flow',
                key: 'data',
                key2: 'data'
            }
        }
    }

    async build(node: Node): Promise<void> {
        node.addOutput(new Output('act', 'On Time', flowPin))
        node.addOutput(new Output('key', 'Key code', numberPin))
        node.addOutput(new Output('key2', 'Key code', numberPin))
    }

    worker(node: INodeData, inputs: IWorkerInputs, data: any): any {
        console.debug()
    }
}
