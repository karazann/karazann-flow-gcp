import { Node, InputsData, OutputsData, FlowControls, NodeMetadata } from './node'

export abstract class NodeBuilder {
    private metadata: NodeMetadata = {}

    constructor(public name: string) {}

    runBuild(node: Node): Node {
        this.build(node)
        return node
    }

    createNode(metadata?: NodeMetadata) {
        const instance = new Node()
        instance.builderName = this.name
        instance.metadata = { ...metadata, ...this.metadata }
        // Build io
        this.runBuild(instance)
        return instance
    }

    abstract build(node: Node): void | Promise<void>
    abstract worker(node: Node, inputs: InputsData, outputs: OutputsData, control: FlowControls): void | Promise<void>
}
