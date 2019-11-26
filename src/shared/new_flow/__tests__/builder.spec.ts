import { Node } from '../node'
import { NodeBuilder } from '../builder'
import { IInputsData, IOutputsData, IFlowControls } from '../node'
import { Output, Input } from '../io'
import { Pin, PinType } from '../pin'

const pinNumber = new Pin('Number', PinType.Data)
const pinFlow = new Pin('Number', PinType.Data)

class NumberNode extends NodeBuilder {
    constructor() {
        super('NumberNode')
    }

    build(node: Node) {
        // Data
        node.addOutput(new Output('number', pinNumber))
    }

    worker(node: Node, input: IInputsData, output: IOutputsData, flow: IFlowControls) {
        output['number'].data = 123
    }
}

class PrintNode extends NodeBuilder {
    constructor() {
        super('PrintNode')
    }

    build(node: Node) {
        // Flows
        node.addInput(new Input('control', pinFlow))
        node.addOutput(new Output('control', pinFlow))
        // Data
        node.addInput(new Input('text', pinNumber))
    }

    worker(node: Node, input: IInputsData, output: IOutputsData, flow: IFlowControls) {
        const inputText = input['text'].data
        console.debug(inputText)
    }
}

describe('NodeBuilder class', () => {
    const numberBuilder = new NumberNode()
    const printBuilder = new PrintNode()

    let nodeInstance1: Node
    let nodeInstance2: Node

    describe('instance', () => { 
        it.todo('should build correctly')
    })

    describe('Nodes', () => {
        
        nodeInstance1 = numberBuilder.createNode()
        nodeInstance2 = printBuilder.createNode()

        it('should created by builder correctly', () => {
            expect(nodeInstance1).toBeDefined()
            expect(nodeInstance2).toBeDefined()
        })

        it('should have corerct builderName', () => { 
            expect(nodeInstance1.builderName).toBe(numberBuilder.name)
            expect(nodeInstance2.builderName).toBe(printBuilder.name)
        })

        it('should have correct incremented ids', () => {
            expect(nodeInstance1.id).toBe(1)
            expect(nodeInstance2.id).toBe(2)
        })

        it('should have correct io', () => { 
            // Number Node
            expect(nodeInstance1.outputs.get('number')).toBeInstanceOf(Output)
            expect(nodeInstance1.outputs.get('number').pin).toBe(pinNumber)
            // Print Node
            expect(nodeInstance2.inputs.get('text')).toBeInstanceOf(Input)
            expect(nodeInstance2.inputs.get('text').pin).toBe(pinNumber)

            expect(nodeInstance2.inputs.get('control')).toBeInstanceOf(Input)
            expect(nodeInstance2.inputs.get('control').pin).toBe(pinFlow)

            expect(nodeInstance2.outputs.get('control')).toBeInstanceOf(Output)
            expect(nodeInstance2.outputs.get('control').pin).toBe(pinFlow)
        })

        it('should connect correctly', () => { 
            const numberNodeOut = nodeInstance1.outputs.get('number')
            const printNodeIn = nodeInstance2.inputs.get('text')

            numberNodeOut.connectTo(printNodeIn)

            expect(nodeInstance1.outputs.get('number').connections).toHaveLength(1)
            expect(nodeInstance2.inputs.get('text').connections).toHaveLength(1)

            // We are expecting the connection instance to be the same
            expect(nodeInstance1.outputs.get('number').connections[0]).toBe(nodeInstance2.inputs.get('text').connections[0])
        })

        it.todo('shhould run the worker correctly if input and output correct')
    })
})
