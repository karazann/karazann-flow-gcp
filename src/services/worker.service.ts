/*!
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import { Service } from 'typedi'
import { Storage, Bucket } from '@google-cloud/storage'
import { logger } from '../utils/logger'
import { FlowEngine } from '../shared/flow'
import { IFlowData } from '../shared/flow/core/data'
import { TimerNode, PrintNode } from '../shared/nodes'

interface IEventData {
    [key: string]: string
}

@Service()
export class WorkerService {
    private readonly engine: FlowEngine = new FlowEngine('name@1.0.0')
    private readonly storage: Storage = new Storage()
    private readonly flowsBucket: Bucket

    /**
     * Get the flows bucket and register the engine nodes here
     */
    constructor() {
        const bucketName = process.env.BUCKET_FLOWS as string
        this.flowsBucket = this.storage.bucket(bucketName)

        // Register the node builders
        const builders = [new TimerNode(), new PrintNode()]
        builders.map(b => {
            this.engine.register(b)
        })
    }

    /**
     * Download the flow data from the Flow Bucket
     * @param flowId Id of the flow we want to download
     * @returns Returns the data of the flow including nodes, connections etc.
     */
    async downloadFlow(flowId: string): Promise<IFlowData> {
        const file = this.flowsBucket.file(flowId)
        const res = await file.download()
        return JSON.parse(res[0].toString())
    }

    /**
     * Download the flow data from the dedicated Cloud Storage bucket and then process it
     * @param flowId Id of the flow
     * @param eventName This is the event which invoked this processing
     * @param eventData These datas separate triggers in the flow
     */
    async processFlow(flowId: string, eventName: string, eventData: IEventData): Promise<boolean> {
        let flowData: IFlowData

        // Download the file and handle errors
        try {
            flowData = await this.downloadFlow(flowId)
        } catch (e) {
            logger.error(e)
            logger.error(`Failed to load flow data from bucket:${process.env.BUCKET_FLOWS}:flowId:${flowId}`)
            return false
        }

        // Process the flow and handle error
        try {
            console.debug(`Processing flow: ${flowId} form trigger: ${eventName}`)
            // TODO finish flow engie to be used here
            await this.engine.process(flowData, 1)
            await this.engine.event(eventName, eventData)
        } catch (e) {
            logger.error(e)
            logger.error(`Failed to process flow: ${flowId}`)
            return false
        }

        return true
    }
}
