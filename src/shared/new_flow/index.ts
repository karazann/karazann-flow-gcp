import { Node, IInputsData, IOutputsData, IFlowControls } from './node'
import { Output, Input } from './io'
import { Pin, PinType } from './pin'

abstract class NodeBuilder {
    constructor(public name: string) {}

    runBuild(node: Node): Node {
        this.build(node)
        return node
    }

    createNode() {
        const instance = new Node()
        instance.builderName = this.name
        // Build io
        this.runBuild(instance)
        return instance
    }

    abstract build(node: Node): void | Promise<void>
    abstract worker(node: Node, inputs: IInputsData, outputs: IOutputsData, control: IFlowControls): void | Promise<void>
}

const controlPin = new Pin('Control', PinType.Flow)
const numberPin = new Pin('Number', PinType.Data)

class OnStart extends NodeBuilder {
    constructor() {
        super('OnStart')
    }

    build(node: Node) {
        node.addOutput(new Output('control', controlPin))
    }

    worker(node: Node, inputs: IInputsData, outputs: IOutputsData, control: IFlowControls) {
        node.processed = true
        control['control']()
    }
}

class Random extends NodeBuilder {
    constructor() {
        super('Random')
    }

    build(node: Node) {
        node.addInput(new Input('control', controlPin))

        node.addOutput(new Output('control', controlPin))
        node.addOutput(new Output('number', numberPin))
        node.addOutput(new Output('number2', numberPin))
    }

    worker(node: Node, inputs: IInputsData, outputs: IOutputsData, control: IFlowControls) {
        node.processed = true
        outputs['number'].data = Math.floor(Math.random() * 100)
        outputs['number2'].data = 10
        control['control']()
    }
}

class Print extends NodeBuilder {
    constructor() {
        super('Print')
    }

    build(node: Node) {
        node.addInput(new Input('control', controlPin))
        node.addInput(new Input('number', numberPin))
        node.addInput(new Input('number2', numberPin))

        node.addOutput(new Output('control', controlPin))
    }

    worker(node: Node, inputs: IInputsData, outputs: IOutputsData, control: IFlowControls) {
        node.processed = true
        const input = inputs['number']
        console.debug(input)

        const input2 = inputs['number2']
        console.debug(input2)

        control['control']()
    }
}

class FlowEngine {
    nodes!: Map<number, Node>
    builders: Map<string, NodeBuilder> = new Map()

    register(builder: NodeBuilder) {
        if (this.builders.has(builder.name)) throw new Error(`Builder ${builder.name} already registered`)
        this.builders.set(builder.name, builder)
    }

    extractInputData(node: Node) {
        const inputData: IInputsData = {}

        for (const key of node.inputs.keys()) {
            const input = node.inputs.get(key) as Input
            if (input.pin.type !== PinType.Flow) {
                const conns = input.connections
                conns.forEach(c => {
                    const prevNode = this.nodes.get(c.output.node?.id as number) as Node

                    if (prevNode.processed) {
                        const output = prevNode.outputDatas[c.input.key]

                        inputData[c.output.key] = output
                    } else {
                        console.debug('node not yet porcessed')
                    }
                })
            }
        }

        return inputData
    }

    startPorcessing(nodes: Map<number, Node>, nodeId: number) {
        this.nodes = nodes
        this.processNode(nodeId)
    }

    processNode(nodeId: number) {
        const node = this.nodes.get(nodeId) as Node
        // evry node need to be processed once
        if (node.processed === true) return

        console.debug(`[Node System]: processing node: ${node.builderName}`)

        // Construct input data form other node outputs
        const inputDatas: IInputsData = this.extractInputData(node)

        // Construct outputs
        const flowControls: IFlowControls = {}
        node.outputs.forEach(o => {
            if (o.pin.type === PinType.Flow) {
                // Build flow controls
                if (o.hasConnection()) {
                    o.connections.forEach(c => {
                        const nextNodeId = c.input.node?.id as number
                        flowControls[o.key] = () => {
                            console.debug(`[Node System] flowing to: ${nextNodeId}`)
                            this.processNode(nextNodeId)
                        }
                    })
                } else {
                    // tslint:disable-next-line: no-empty
                    flowControls[o.key] = () => {}
                }
            } else {
                // Create the output data holder pointers for the node
                node.outputDatas[o.key] = {
                    data: undefined
                }
            }
        })

        // calculate the output of the node then flow
        const builder = this.builders.get(node.builderName)
        if (!builder) throw new Error('Builder not registered')

        console.debug(`[Node System] working on: ${node.builderName}`)
        // console.debug(inputData, n.outputData)
        builder.worker(node, inputDatas, node.outputDatas, flowControls)
    }
}

const engine = new FlowEngine()

const nodes: Map<number, Node> = new Map()

// create Builders
const onStartBuilder = new OnStart()
const randomBuilder = new Random()
const printBuilder = new Print()

// Register them
engine.register(onStartBuilder)
engine.register(randomBuilder)
engine.register(printBuilder)

// Create the nodes
const onStart = onStartBuilder.createNode()
const random = randomBuilder.createNode()
const print = printBuilder.createNode()

// Flows connect
const onStartControlOut = onStart.outputs.get('control') as Output
const randomControlIn = random.inputs.get('control') as Input
onStartControlOut.connectTo(randomControlIn)

const randomControlOut = random.outputs.get('control') as Output
const printControlIn = print.inputs.get('control') as Input
randomControlOut.connectTo(printControlIn)

// Number connect
const randomNumberOut = random.outputs.get('number') as Output
const printNumberIn = print.inputs.get('number') as Input
randomNumberOut.connectTo(printNumberIn)

// nuber 2 connect
const randomNumber2Out = random.outputs.get('number2') as Output
const printNumber2In = print.inputs.get('number2') as Input
randomNumber2Out.connectTo(printNumber2In)

nodes.set(1, onStart)
nodes.set(2, random)
nodes.set(3, print)

engine.startPorcessing(nodes, 1)
console.log(nodes)

