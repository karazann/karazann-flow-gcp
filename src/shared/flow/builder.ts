import { NodeData, WorkerInputs, WorkerOutputs } from './core/data'
import { Node } from './node'
import { ITaskConfig } from './task'

export abstract class NodeBuilder {
    public data: unknown = {}
    public name: string
    public task!: ITaskConfig

    constructor(name: string) {
        this.name = name
    }

    public async runBuild(node: Node): Promise<Node> {
        await this.build(node)
        return node
    }

    public async createNode(data = {}): Promise<Node> {
        const node = new Node(this.name)

        node.data = data
        await this.runBuild(node)

        return node
    }

    public abstract worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs): void
    protected abstract async build(node: Node): Promise<void>
}
