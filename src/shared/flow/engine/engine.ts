import { Node, IInputsData, IFlowControls } from '../node'
import { Input } from '../io'
import { PinType } from '../pin'
import { Context } from '../core/context'

export class FlowEngine extends Context {
    nodes!: Map<number, Node>

    extractInputData(node: Node) {
        const inputData: IInputsData = {}

        for (const key of node.inputs.keys()) {
            const input = node.inputs.get(key) as Input
            if (input.pin.type !== PinType.Flow) {
                const conns = input.connections
                conns.forEach(c => {
                    const prevNode = this.nodes.get((c.output.node as Node).id as number) as Node

                    if (prevNode.processed) {
                        const output = prevNode.outputDatas[c.input.key]

                        inputData[c.output.key] = output
                    } else {
                        console.debug('node not yet porcessed')
                    }
                })
            }
        }
        return inputData
    }

    async startPorcessing(nodes: Map<number, Node>, nodeId: number) {
        this.nodes = nodes
        await this.processNode(nodeId)
    }

    /*async processUnreachable(): Promise<void> {
        const data = this.data as IFlowData

        for (const i of Object.keys(data.nodes)) {
            // process nodes that have not been reached
            const node = data.nodes[i] as IEngineNode

            if (typeof node.outputData === 'undefined') {
                await this.processNode(node)
                await this.forwardProcess(node)
            }
        }
    }*/

    async processNode(nodeId: number) {
        const node = this.nodes.get(nodeId) as Node
        // Every node need to be processed once
        if (node.processed === true) return

        console.debug(`[Node System]: processing node: ${node.builderName}`)

        // Construct input data form other node outputs
        const inputDatas: IInputsData = this.extractInputData(node)

        // Construct outputs
        const flowControls: IFlowControls = {}
        node.outputs.forEach(o => {
            if (o.pin.type === PinType.Flow) {
                // Build flow controls
                if (o.hasConnection()) {
                    o.connections.forEach(c => {
                        const nextNodeId = (c.input.node as Node).id as number
                        flowControls[o.key] = async () => {
                            console.debug(`[Node System] flowing to: ${nextNodeId}`)
                            await this.processNode(nextNodeId)
                        }
                    })
                } else {
                    // tslint:disable-next-line: no-empty
                    flowControls[o.key] = () => {}
                }
            } else {
                // Create the output data holder pointers for the node
                node.outputDatas[o.key] = {
                    data: undefined
                }
            }
        })

        // Get the builder for the node
        const builder = this.builders.get(node.builderName)
        if (!builder) throw new Error('Builder not registered')

        console.debug(`[Node System] working on: ${node.builderName}`)
        // console.debug(inputData, n.outputData)
        await builder.worker(node, inputDatas, node.outputDatas, flowControls)
    }
}