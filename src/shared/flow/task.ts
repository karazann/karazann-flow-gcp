/*!
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import { IWorkerOutputs, IWorkerInputs, INodeData } from './core/data'
import { NodeBuilder } from './builder'

type Worker = (ctx: Task, inputs: IWorkerInputs, data: any) => IWorkerOutputs
type OutputType = 'flow' | 'data'

export interface ITaskConfig {
    init?: (task: Task, node?: INodeData) => void
    eventName?: string
    outputs: { [key: string]: OutputType }
}

export class Task {
    closed: unknown[] = []
    private next: unknown[] = []
    private outputData!: IWorkerOutputs

    // TODO: Replace any with proper type
    constructor(private inputs: any, private worker: any) {
        this.getInputs('flow').forEach(key => {
            this.inputs[key].forEach((con: any) => {
                con.task.next.push({ key: con.key, task: this })
            })
        })
    }

    async run(data: any, needReset = true, garbage: Task[] = [], propagate = true) {
        if (needReset) garbage.push(this)

        if (!this.outputData) {
            const inputs: any = {}

            await Promise.all(
                this.getInputs('data').map(async key => {
                    inputs[key] = await Promise.all(
                        this.inputs[key].map(async (con: any) => {
                            if (con) {
                                await con.task.run(data, false, garbage, false)
                                return con.task.outputData[con.key]
                            }
                        })
                    )
                })
            )

            this.outputData = await this.worker(this, inputs, data)

            const nexts = this.next.filter((f: any) => !this.closed.includes(f.key)).map(async (f: any) => await f.task.run(data, false, garbage))
            if (propagate) await Promise.all(nexts)
        }

        if (needReset) garbage.map(t => t.reset())
    }

    reset() {
        this.outputData = {}
    }

    private getInputs(type: OutputType) {
        return Object.keys(this.inputs)
            .filter(key => this.inputs[key][0])
            .filter(key => this.inputs[key][0].type === type)
    }
}
