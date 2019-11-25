/*!
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import { INodeData, IWorkerInputs, IWorkerOutputs } from './core/data'
import { Node } from './node'
import { ITaskConfig } from './task'

export abstract class NodeBuilder {
    task!: ITaskConfig
    name: string
    data: unknown = {}

    constructor(name: string) {
        this.name = name
    }

    async runBuild(node: Node): Promise<Node> {
        await this.build(node)
        return node
    }

    async createNode(data = {}): Promise<Node> {
        const node = new Node(this.name)

        node.data = data
        await this.runBuild(node)

        return node
    }

    abstract worker(node: INodeData, inputs: IWorkerInputs, outputs: IWorkerOutputs): void | Promise<void>
    abstract build(node: Node): void | Promise<void>
}
