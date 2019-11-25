/*!
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import { logger } from './utils/logger'

jest.setTimeout(10000)

let savedEnv: any

beforeEach(() => {
    // save current env vars
    savedEnv = process.env

    // Setup env vars for testing
    process.env.DB_USER = 'postgres'
    process.env.DB_PASSWORD = 'root'
    process.env.DB_DATABASE = 'karazann-test'
    process.env.TOPIC_JOBS = 'jobs-test'
    process.env.BUCKET_FLOWS = 'flows-test'

    // Silence winston
    logger.silent = true
})

afterEach(() => {
    // restore env vars
    process.env = savedEnv
})
