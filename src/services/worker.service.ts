import { Service } from 'typedi'
import { Storage, Bucket } from '@google-cloud/storage'
import { logger } from '../utils/logger'
import { FlowEngine } from '../shared/flow'
import { IFlowData } from '../shared/flow/core/data'

@Service()
export class WorkerService {
    private readonly engine: FlowEngine = new FlowEngine('name@1.0.0')
    private readonly storage: Storage = new Storage()
    private readonly flowsBucket: Bucket

    constructor() {
        const bucketName = process.env.BUCKET_FLOWS as string
        this.flowsBucket = this.storage.bucket(bucketName)
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
     * @param triggerNode
     */
    async processFlow(flowId: string, triggerNode: string): Promise<boolean> {
        let flowData: IFlowData

        // Download the file and handle errors
        try {
            console.debug('Downloading flow: ', flowId)
            flowData = await this.downloadFlow(flowId)
        } catch (e) {
            logger.error(e)
            logger.error(`Failed to load flow data from bucket:${process.env.BUCKET_FLOWS}:flowId:${flowId}`)
            return false
        }

        // Process the flow and handle error
        try {
            console.debug(`Processing flow: ${flowId} form trigger: ${triggerNode}`)
            await this.engine.process(flowData)
        } catch (e) {
            logger.error(e)
            logger.error(`Failed to process flow: ${flowId}`)
            return false
        }

        return true
    }
}
