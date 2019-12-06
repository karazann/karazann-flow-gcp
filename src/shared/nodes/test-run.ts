/*!
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import { Input, Output, FlowEngine } from '../flow'
// import { TimerNode, PrintNode } from './index'

/*const run = async (): Promise<void> => {
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

    console.log(JSON.stringify(flowData))

    await engine.exit()
    await engine.process(flowData, 1)

    await engine.event('test', { test: 123 })
}

run()*/
