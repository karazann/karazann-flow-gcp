/*!
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import { Storage } from '@google-cloud/storage'
import { Service } from 'typedi'
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
}
