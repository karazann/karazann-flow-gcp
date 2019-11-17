import 'reflect-metadata' // this shim is required
import { Container } from 'typedi'
import { createExpressServer, useContainer } from 'routing-controllers'
import { FlowWorkerController, FlowEventsController } from './controllers'
import { StorageService } from './services/StorageService'
import { config, parse } from 'dotenv'

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
        controllers: [FlowEventsController, FlowWorkerController] // we specify controllers we want to use
    })

    // run express application on port
    const PORT = parseInt(process.env.PORT as string, 10) || 8080
    server.listen(PORT)
}

boot()
