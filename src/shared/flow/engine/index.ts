/*!
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import { IFlowData, INodeData, IWorkerInputs, IWorkerOutputs } from '../core/data'
import State from './state'
import { NodeBuilder } from '../builder'
import { Context } from '../core/context'

const copy = (data: IFlowData) => {
    return JSON.parse(JSON.stringify(data))
}

interface IEngineNode extends INodeData {
    busy: boolean
    unlockPool: Array<() => void>
    outputData: IWorkerOutputs
}

export class FlowEngine extends Context {
    private data: IFlowData | null = null
    private state = State.AVAILABLE

    constructor(id: string) {
        super(id)
    }

    async process(data: IFlowData, startId: number | string | null = null): Promise<string | void> {
        if (!this.processStart()) {
            return
        }
        // if (!this.validate(data)) return

        this.data = copy(data)

        await this.processStartNode(startId)
        // await this.processUnreachable()

        return this.processDone() ? 'success' : 'aborted'
    }

    async exit(): Promise<void> {
        return new Promise(ret => {
            if (this.state === State.PROCESSED) {
                this.state = State.ABORT
            } else {
                ret()
            }
        })
    }

    private processStart(): boolean {
        if (this.state === State.AVAILABLE) {
            this.state = State.PROCESSED
            return true
        }

        if (this.state === State.ABORT) {
            return false
        }

        console.debug(`The process is busy and has not been restarted. Use abort() to force it to complete`)
        return false
    }

    private processDone(): boolean {
        const success = this.state !== State.ABORT
        this.state = State.AVAILABLE
        return success
    }

    private async throw(message: string, data: unknown = null): Promise<string> {
        await this.exit()
        this.processDone()

        return 'error'
    }

    private async lock(node: IEngineNode): Promise<void> {
        return new Promise(res => {
            node.unlockPool = node.unlockPool || []
            if (node.busy && !node.outputData) {
                node.unlockPool.push(res)
            } else {
                res()
            }

            node.busy = true
        })
    }

    private unlock(node: IEngineNode): void {
        node.unlockPool.forEach(a => a())
        node.unlockPool = []
        node.busy = false
    }

    private async extractInputData(nodeData: INodeData): Promise<IWorkerInputs> {
        const obj: IWorkerInputs = {}

        for (const key of Object.keys(nodeData.inputs)) {
            const input = nodeData.inputs[key]
            const conns = input.connections
            const connData = await Promise.all(
                conns.map(async c => {
                    const prevNode = (this.data as IFlowData).nodes[c.node]

                    const outputs = await this.processNode(prevNode as IEngineNode)

                    if (!outputs) {
                        this.exit()
                    } else {
                        return outputs[c.output]
                    }
                })
            )

            obj[key] = connData
        }

        return obj
    }

    private async processWorker(nodeData: INodeData): Promise<IWorkerOutputs> {
        const inputData = await this.extractInputData(nodeData)
        const node = this.nodes.get(nodeData.name) as NodeBuilder
        const outputData: IWorkerOutputs = {}

        try {
            await node.worker(nodeData, inputData, outputData)
        } catch (e) {
            this.exit()
        }

        return outputData
    }

    private async processNode(node: IEngineNode): Promise<IWorkerOutputs | null> {
        if (this.state === State.ABORT || !node) {
            return null
        }

        await this.lock(node)

        if (!node.outputData) {
            node.outputData = await this.processWorker(node)
        }

        this.unlock(node)

        console.debug('processNode')
        return node.outputData
    }

    private async forwardProcess(node: INodeData): Promise<void[][] | null> {
        if (this.state === State.ABORT) {
            return null
        }

        return await Promise.all(
            Object.keys(node.outputs).map(async key => {
                const output = node.outputs[key]

                return await Promise.all(
                    output.connections.map(async c => {
                        const nextNode = (this.data as IFlowData).nodes[c.node]

                        await this.processNode(nextNode as IEngineNode)
                        await this.forwardProcess(nextNode)
                    })
                )
            })
        )
    }

    private async processStartNode(id: string | number | null): Promise<string | void> {
        if (!id) {
            return
        }

        const startNode = (this.data as IFlowData).nodes[id]

        if (!startNode) {
            return await this.throw('Node with such id not found')
        }

        await this.processNode(startNode as IEngineNode)
        await this.forwardProcess(startNode)
    }

    private async processUnreachable(): Promise<void> {
        const data = this.data as IFlowData

        for (const i of Object.keys(data.nodes)) {
            // process nodes that have not been reached
            const node = data.nodes[i] as IEngineNode

            if (typeof node.outputData === 'undefined') {
                await this.processNode(node)
                await this.forwardProcess(node)
            }
        }
    }
}
