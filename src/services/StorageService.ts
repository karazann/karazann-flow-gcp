import { Storage } from '@google-cloud/storage'
import { Service } from 'typedi'
import { log } from '../logger'

@Service()
export class StorageService {
    private storage: Storage

    constructor() {
        this.storage = new Storage()
    }

    public async getDotenv(bucketName: string): Promise<Buffer | void> {
        try {
            const secretsFile = this.storage.bucket(bucketName).file('.env')
            const buffers = await secretsFile.download()
            console.log(buffers[0])
            return buffers[0]
        } catch (e) {
            console.log(e)
            // Complete a structured log entry.
            const entry = log.entry(`Failed to load .env file from bucket: ${bucketName}`)
            log.emergency(entry, () => {  })
            return
        }
    }
}
