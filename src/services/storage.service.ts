import { Storage } from '@google-cloud/storage'
import { Service } from 'typedi'
import { FlowData } from '@szkabaroli/karazann-flow/lib/core/data'
import { logger } from '../utils/logger'

@Service()
export class StorageService {
    private readonly storage: Storage

    constructor() {
        this.storage = new Storage()
    }

    async getDotenv(bucketName: string): Promise<Buffer | null> {
        try {
            const secretsFile = this.storage.bucket(bucketName).file('.env')
            const buffers = await secretsFile.download()
            return buffers[0]
        } catch (e) {
            logger.emerg({ message: 'Failed to load .env from bucket: ${bucketName}' })
            return null
        }
    }

    async getFlowDataFromBucket(flowsBucketName: string, flowId: string): Promise<FlowData | null> {
        try {
            const secretsFile = this.storage.bucket(flowsBucketName).file('.env')
            const buffers = await secretsFile.download()
            return JSON.parse(buffers[0].toString())
        } catch (e) {
            logger.error({ message: 'Failed to flow data request' })
            return null
        }
    }
}
