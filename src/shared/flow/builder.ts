import { Node, IInputsData, IOutputsData, IFlowControls } from './node'

export abstract class NodeBuilder {
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
