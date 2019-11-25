/*!
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import { isValidId } from './validator'
import { NodeBuilder } from '../builder'
import { Task } from '../task'

type TriggerFunction = () => Promise<void>

export class Context {
    protected plugins: Map<string, unknown> = new Map()
    protected nodes: Map<string, NodeBuilder> = new Map()
    protected triggers: Map<string, TriggerFunction> = new Map()

    constructor(public id: string) {
        if (!isValidId(id)) throw new Error('ID should be valid to name@0.1.0 format')
    }

    async event(triggerName: string) { 
        const trigger = this.triggers.get(triggerName) as TriggerFunction 
        await trigger()
    }

    register(builder: NodeBuilder): void {
        if (this.nodes.has(builder.name)) throw new Error(`Builder ${builder.name} already registered`)

        this.nodes.set(builder.name, builder)

        // Task setup
        if (!builder.task) throw new Error('Task property required in component')

        const taskWorker = builder.worker
        // tslint:disable-next-line: no-empty
        const init = builder.task.init || (() => { })
        const eventName = builder.task.eventName
        const types = builder.task.outputs

        // Bypass deafult worker
        builder.worker = (node, inputs, outputs) => {
            const task = new Task(inputs, (ctx: any, inps: any, data: any) => {
                return taskWorker.call(ctx, node, inps, data)
            })

            // If eventName exist and not false register the trigger
            if (eventName) { 
                this.triggers.set(eventName, async () => { await task.run({}) })
            }

            init(task, node)

            Object.keys(types).map(key => {
                outputs[key] = { type: types[key], key, task }
            })
        }
    }
}
