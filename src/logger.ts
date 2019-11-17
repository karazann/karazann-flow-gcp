import { createLogger, transports } from 'winston'
import { LoggingWinston } from '@google-cloud/logging-winston'

const loggingWinston = new LoggingWinston()

export const logger = createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    transports: [
        new transports.Console(),
        // Add Stackdriver Logging
        loggingWinston
    ]
})