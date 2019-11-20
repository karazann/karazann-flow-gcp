import { WorkerOutputs, WorkerInputs, NodeData } from './core/data'
import { NodeBuilder } from './builder'

type Worker = (ctx: Task, inputs: WorkerInputs, data: any) => WorkerOutputs
type OutputType = 'flow' | 'data'

export interface ITaskConfig {
    init?: (task: Task, node?: NodeData) => void
    outputs: { [key: string]: OutputType }
}

export class Task {
    private next: unknown[] = []
    private outputData!: WorkerOutputs
    private closed: unknown[] = []

    // TODO: Replace any with proper type
    constructor(private inputs: any, private worker: any) {
        this.getInputs('flow').forEach(key => {
            this.inputs[key].forEach((con: any) => {
                con.task.next.push({ key: con.key, task: this })
            })
        })
    }

    public async run(data: any, needReset = true, garbage: Task[] = [], propagate = true) {
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

            if (propagate) await Promise.all(this.next.filter((f: any) => !this.closed.includes(f.key)).map(async (f: any) => await f.task.run(data, false, garbage)))
        }

        if (needReset) garbage.map(t => t.reset())
    }

    public reset(): void {
        this.outputData = {}
    }

    private getInputs(type: OutputType) {
        return Object.keys(this.inputs)
            .filter(key => this.inputs[key][0])
            .filter(key => this.inputs[key][0].type === type)
    }
}
