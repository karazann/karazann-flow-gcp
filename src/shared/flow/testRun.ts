import { Node, InputsData, OutputsData, FlowControls } from './node'
import { Output, Input } from './io'
import { Pin, PinType } from './pin'
import { NodeBuilder } from './builder'
import { FlowEngine } from './engine/engine'

const controlPin = new Pin('Control', PinType.Flow)
const numberPin = new Pin('Number', PinType.Data)

class OnStart extends NodeBuilder {
    constructor() {
        super('OnStart')
    }

    build(node: Node) {
        node.addOutput(new Output('control', '', controlPin))
    }

    async worker(node: Node, inputs: InputsData, outputs: OutputsData, control: FlowControls) {
        node.processed = true
        control['control']()
    }
}

class Random extends NodeBuilder {
    constructor() {
        super('Random')
    }

    build(node: Node) {
        node.addInput(new Input('control', '', controlPin))

        node.addOutput(new Output('control', '', controlPin))
        node.addOutput(new Output('number', '', numberPin))
        node.addOutput(new Output('number2', '', numberPin))
    }

    async worker(node: Node, inputs: InputsData, outputs: OutputsData, control: FlowControls) {
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
        node.addInput(new Input('control', '', controlPin))
        node.addInput(new Input('number', '', numberPin))
        node.addInput(new Input('number2', '', numberPin))

        node.addOutput(new Output('control', '', controlPin))
    }

    async worker(node: Node, inputs: InputsData, outputs: OutputsData, control: FlowControls) {
        node.processed = true
        const input = inputs['number']
        console.debug(input)

        const input2 = inputs['number2']
        console.debug(input2)

        control['control']()
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
console.debug(123)
