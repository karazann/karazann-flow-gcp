/*!
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import { Storage } from '@google-cloud/storage'
import { config, parse } from 'dotenv'
import { Container } from 'typedi'
import { logger } from './logger'

/**
 * This function load the environent variables to process.env from .env file in local environment or from Cloud Storage in production
 * @return Return true if load the vars successfully else returns false.
 */
export const loadEnv = async () => {
    if (process.env.NODE_ENV === 'production') {
        const secretsBucketName = process.env.SECRETS_BUCKET as string
        const storage = new Storage()

        try {
            const secretsFile = storage.bucket(secretsBucketName).file('.env')
            const buffers = await secretsFile.download()
            const dotenv = buffers[0]
            const env = parse(dotenv)

            for (const k in env) {
                if (env.hasOwnProperty(k)) {
                    process.env[k] = env[k]
                }
            }

            return true
        } catch (e) {
            logger.error(e)
            logger.emerg({ message: 'Failed to load .env from bucket: ${bucketName}' })
            return false
        }
    } else {
        config()
        return true
    }
}
