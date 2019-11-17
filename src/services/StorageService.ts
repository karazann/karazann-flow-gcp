import { Storage } from '@google-cloud/storage'
import { Service } from 'typedi'

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
            return buffers[0]
        } catch (e) { 
            console.error(e)
        }
    }
}
