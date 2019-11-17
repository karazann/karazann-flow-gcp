import { createLogger, transports } from 'winston'
import { LoggingWinston } from '@google-cloud/logging-winston'

// Imports the Google Cloud client library for Winston
const loggingWinston = new LoggingWinston({
    serviceContext: {
        service: 'karazann-flow-engine-production',
        version: 'qa',
    },
})

const { Console } = transports

export const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transports: [
        loggingWinston,
        new Console()
    ]
})
