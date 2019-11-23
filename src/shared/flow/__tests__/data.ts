import { NodeBuilder, Node, Output, Pin } from '../index'
import { INodeData, IWorkerInputs } from '../core/data'
import { Task } from '../task'

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

    public async build(node: Node): Promise<void> {
        node.addOutput(new Output('act', 'On Time', flowPin))
        node.addOutput(new Output('key', 'Key code', numberPin))
    }

    public worker(node: INodeData, inputs: IWorkerInputs, data: any): any {
        console.log()
    }
}

export class Builder2 extends NodeBuilder {
    constructor() {
        super('Builder2')
        this.task = {
            outputs: {
                act: 'flow',
                key: 'data',
                key2:'data'
            }
        }
    }

    public async build(node: Node): Promise<void> {
        node.addOutput(new Output('act', 'On Time', flowPin))
        node.addOutput(new Output('key', 'Key code', numberPin))
        node.addOutput(new Output('key2', 'Key code', numberPin))
    }

    public worker(node: INodeData, inputs: IWorkerInputs, data: any): any {
        console.log()
    }
}
