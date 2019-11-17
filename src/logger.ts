import { createLogger, transports } from 'winston'
import { LoggingWinston } from '@google-cloud/logging-winston'

const loggingWinston = new LoggingWinston()

// Complete a structured log entry.
const entry = Object.assign(
    {
        severity: 'ERROR',
        message: 'This is the default display field.',
        // Log viewer accesses 'component' as 'jsonPayload.component'.
        component: 'arbitrary-property'
    },
    {}
)

console.error(JSON.stringify(entry))

// Serialize to a JSON string and output.
console.log(JSON.stringify(entry))

export const logger = createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    transports: [
        new transports.Console(),
        // Add Stackdriver Logging
        loggingWinston
    ]
})
