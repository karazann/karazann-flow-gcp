/*!
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import { logger } from './utils/logger'

beforeAll(() => {
    // Silence winston
    logger.transports.forEach(t => (t.silent = true))

    // Setup env variables for testing
    process.env.NODE_ENV = 'test'
    process.env.DB_USER = 'postgres'
    process.env.DB_PASSWORD = 'root'
    process.env.DB_DATABASE = 'karazann-test'
    process.env.TOPIC_JOBS = 'jobs-test'
    process.env.BUCKET_FLOWS = 'flows-test'
})
