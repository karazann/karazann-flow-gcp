import { isValidId } from './validator'
import { NodeBuilder } from '../builder'
import { WorkerInputs, WorkerOutputs, NodeData } from './data'
import { Task } from '../task'
import { Worker } from 'cluster'

export class Context {
    protected plugins!: Map<string, unknown>
    protected nodes!: Map<string, NodeBuilder>

    constructor(public id: string) {
        if (!isValidId(id)) throw new Error('ID should be valid to name@0.1.0 format')

        this.plugins = new Map()
        this.nodes = new Map()
    }

    public register(builder: NodeBuilder): void {
        if (this.nodes.has(builder.name)) throw new Error(`Builder ${builder.name} already registered`)

        this.nodes.set(builder.name, builder)

        if (!builder.task) throw new Error('Task plugin requires a task property in component')

        const taskWorker = builder.worker
        // tslint:disable-next-line: no-empty
        const init = builder.task.init || ((): void => {})
        const types = builder.task.outputs

        // bypass worker
        builder.worker = (node, inputs, outputs) => {
            const task = new Task(inputs, (ctx: any, inps: any, data: any) => {
                return taskWorker.call(ctx, node, inps, data)
            })

            init(task, node)

            Object.keys(types).map(key => {
                outputs[key] = { type: types[key], key, task }
            })
        }
    }
}
