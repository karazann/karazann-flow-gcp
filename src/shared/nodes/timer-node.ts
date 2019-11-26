/*!
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import { NodeBuilder, Node, Output } from '../flow'
import { INodeData, IWorkerInputs } from '../flow/core/data'
import { FlowPin, NumberPin } from './pins'

export class TimerNode extends NodeBuilder {
    constructor() {
        super('Timer')
        this.task = {
            outputs: {
                act: 'flow',
                key: 'data'
            },
            eventName: 'test'
        }
    }

    build(node: Node) {
        node.addOutput(new Output('act', 'On Time', FlowPin))
        node.addOutput(new Output('key', 'Key code', NumberPin))
    }

    worker(node: INodeData, inputs: IWorkerInputs, data: any): any {
        console.log(data)
        return { key: 10 }
    }
}
