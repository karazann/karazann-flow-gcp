import { FlowPin, NumberPin } from './pins'
import { NodeBuilder, Input, Node } from '../flow'
import { INodeData, IWorkerInputs } from '../flow/core/data'

export class PrintNode extends NodeBuilder {
    constructor() {
        super('Print')
        this.task = {
            outputs: {}
        }
    }

    build(node: Node) {
        node.addInput(new Input('act', 'Start', FlowPin))
        node.addInput(new Input('key', 'Key', NumberPin))
    }

    worker(node: INodeData, inputs: IWorkerInputs, data: any) {
        console.debug('Alert', node, data, inputs)
    }
}
