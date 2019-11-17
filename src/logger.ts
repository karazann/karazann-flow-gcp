import { createLogger, transports, format } from 'winston'
import { LoggingWinston } from '@google-cloud/logging-winston'

const { combine, timestamp, label, printf, prettyPrint, splat, simple, json } = format

// Imports the Google Cloud client library for Winston
const gcpLogger = new LoggingWinston({
    serviceContext: {
        service: 'karazann-flow-engine-production',
        version: 'qa'
    },
    labels: {
        name: 'some-name',
        version: '0.1.0'
    }
})

const { Console } = transports

const severityLevel = format((info, opts) => {
    info.severity = info.level.toUpperCase()
    delete info.level
    return info
})

export const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(severityLevel(), json()),
    transports: [gcpLogger, new Console()]
})
