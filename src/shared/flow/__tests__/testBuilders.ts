import { Output, Input } from '../io'
import { IInputsData, IOutputsData, IFlowControls } from '../node'
import { NodeBuilder } from '../builder'
import { PinType, Pin } from '../pin'
import { Node } from '../node'

export const pinNumber = new Pin('Number', PinType.Data)
export const pinFlow = new Pin('Number', PinType.Data)

export class NumberNode extends NodeBuilder {
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

export class PrintNode extends NodeBuilder {
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