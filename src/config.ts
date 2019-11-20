/**
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import { StorageService } from './services/StorageService'
import { config, parse } from 'dotenv'
import { Container } from 'typedi'

/**
 * This function load the environent variables to process.env from .env file in local environment or from Cloud Storage in production
 * @return Return true if load the vars successfully else returns false.
 */
export const loadEnv = async () => {
    if (process.env.NODE_ENV === 'production') {
        const dotenv = await Container.get(StorageService).getDotenv(process.env.SECRETS_BUCKET as string)
        if (dotenv) {
            const env = parse(dotenv)
            for (const k in env) {
                if (env.hasOwnProperty(k)) {
                    process.env[k] = env[k]
                }
            }
            return true
        } else {
            return false
        }
    } else {
        config()
        return true
    }
}