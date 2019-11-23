import { logger } from "./utils/logger"

jest.setTimeout(10000)

let savedEnv: any

beforeEach(async () => {
    // save current env vars
    savedEnv = process.env

    // Setup env vars for testing
    process.env.DB_USER = 'postgres'
    process.env.DB_PASSWORD = 'root'
    process.env.DB_DATABASE = 'karazann-test'
    process.env.TOPIC_JOBS = 'jobs-test'

    // Silence winston
    logger.silent = true
})

afterEach(() => {
    // restore env vars
    process.env = savedEnv
})