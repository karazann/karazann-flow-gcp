import { Storage } from '@google-cloud/storage'
import { Service } from 'typedi'
import { FlowData } from '@szkabaroli/karazann-flow/lib/core/data'

@Service()
export class StorageService {
    private storage: Storage

    constructor() {
        this.storage = new Storage()
    }

    public async getDotenv(bucketName: string): Promise<Buffer | null> {
        try {
            const secretsFile = this.storage.bucket(bucketName).file('.env')
            const buffers = await secretsFile.download()
            return buffers[0]
        } catch (e) {
            const entry = {
                severity: 'CRITICAL',
                message: `Failed to load .env from bucket: ${bucketName}`
            }
            console.error(entry)
            return null
        }
    }

    /**
     * getFlowData
     */
    public async getFlowDataFromBucket(bucketName: string, flowId: string): Promise<FlowData | null> {
        try {
            const secretsFile = this.storage.bucket(bucketName).file('.env')
            const buffers = await secretsFile.download()
            console.log()
            return JSON.parse(buffers[0].toString())
        } catch (e) {
            // Complete a structured log entry.
            const entry = {
                severity: 'ERROR',
                message: `Failed to flow data request`
            }
            console.error(entry)
            return null
        }
    }
}
