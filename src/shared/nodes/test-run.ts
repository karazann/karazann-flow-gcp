/*!
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import { Node, NodeBuilder, Input, Output, FlowEngine, Pin,  } from '../flow'
import { INodeData, IWorkerInputs, IWorkerOutputs, IFlowData } from '../flow/core/data'
import { Task } from '../flow/task'

const FlowPin = new Pin('Flow')
const NumberPin = new Pin('Number')

let runs: () => void = () => {}

class TimerNode extends NodeBuilder {
    constructor() {
        super('Timer')
        this.task = {
            outputs: {
                act: 'flow',
                key: 'data'
            },
            init(task: Task) {
                // tslint:disable-next-line: only-arrow-functions
                runs = () => {
                    
                    setTimeout(() => {
                        task.run({t: 323})
                        task.reset()
                    }, 0)
                }
            }
        }
    }

    build(node: Node) {
        node.addOutput(new Output('act', 'On Time', FlowPin))
        node.addOutput(new Output('key', 'Key code', NumberPin))
    }

    worker(node: INodeData, inputs: IWorkerInputs, data: any): any {

        return { key: 10 }
    }
}

class PrintNode extends NodeBuilder {
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

const run = async (): Promise<void> => {
    const id = 'test@1.0.0'

    const engine = new FlowEngine(id)
    const builders = [new TimerNode(), new PrintNode()]

    builders.map(c => {
        engine.register(c)
    })

    const timer = await builders[0].createNode()
    const print = await builders[1].createNode()

    const timerout = timer.outputs.get('act') as Output
    timerout.connectTo(print.inputs.get('act') as Input)

    const timer2out = timer.outputs.get('key') as Output
    timer2out.connectTo(print.inputs.get('key') as Input)

    timer.position = [80, 200]
    print.position = [80, 400]

    const nodes = [timer, print]

    const flowData: IFlowData = { id, nodes: {} }
    
    nodes.forEach(node => {
        flowData.nodes[node.id] = node.toJSON()
    })

    await engine.exit()
    await engine.process(flowData, 1)

    runs()
}

run()