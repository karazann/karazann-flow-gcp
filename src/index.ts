import 'reflect-metadata' // this shim is required
import { Container } from 'typedi'
import { createExpressServer, useContainer } from 'routing-controllers'
import { FlowWorkerController, FlowEventsController } from './controllers'
import { StorageService } from './services/StorageService'
import { config, parse } from 'dotenv'


import bunyan from 'bunyan'

// Imports the Google Cloud client library for Bunyan
import { LoggingBunyan } from '@google-cloud/logging-bunyan'

// Creates a Bunyan Stackdriver Logging client
const loggingBunyan = new LoggingBunyan()

// Create a Bunyan logger that streams to Stackdriver Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/bunyan_log"
const logger = bunyan.createLogger({
  // The JSON payload of the log as it appears in Stackdriver Logging
  // will contain "name": "my-service"
  name: 'my-service',
  streams: [
    // Log to the console at 'info' and above
    {stream: process.stdout, level: 'info'},
    // And log to Stackdriver Logging, logging at 'info' and above
    loggingBunyan.stream('info'),
  ],
})

// Writes some log entries
logger.error('warp nacelles offline')
logger.info('shields at 99%')

/** Error Levels
 * DEFAULT  (0) The log entry has no assigned severity level.
 * DEBUG    (100) Debug or trace information.
 * INFO     (200) Routine information, such as ongoing status or performance.
 * NOTICE   (300) Normal but significant events, such as start up, shut down, or a configuration change.
 * WARNING  (400) Warning events might cause problems.
 * ERROR    (500) Error events are likely to cause problems.
 * CRITICAL (600) Critical events cause more severe problems or outages.
 * ALERT    (700) A person must take an action immediately.
 * EMERGENCY(800) One or more systems are unusable.
 */

const boot = async () => {
    // Get the storage service
    const storageService = Container.get(StorageService)

    // Environment variable setup (in production download this form storage bucket to avoid unwanted access to env vars)
    if (process.env.NODE_ENV === 'production') {
        const dotenv = await storageService.getDotenv(process.env.SECRETS_BUCKET as string)
        if (dotenv) {
            const env = parse(dotenv)
            for (const k in env) {
                if (env.hasOwnProperty(k)) {
                    process.env[k] = env[k]
                }
            }
        }
    } else {
        config()
    }

    // Setup typedi dependency injection for controllers
    useContainer(Container)

    const server = createExpressServer({
        routePrefix: '/',
        controllers: [FlowEventsController, FlowWorkerController] // we specify controllers we want to use
    })

    // run express application on port
    const PORT = parseInt(process.env.PORT as string, 10) || 8080
    server.listen(PORT)
}

boot()
