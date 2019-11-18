import 'reflect-metadata' // this shim is required
import { Container, Inject } from 'typedi'
import { useContainer, useExpressServer } from 'routing-controllers'
import { StorageService } from './services/StorageService'
import { config, parse } from 'dotenv'
import { logger } from './logger'
import express from 'express'

class Server {
    private app: express.Application
    private PRODUCTION_ENV = process.env.NODE_ENV === 'production'

    @Inject()
    private storageService!: StorageService

    constructor() {
        this.app = express()
        this.loadEnvVars()
        this.config()
    }

    public start(): void {
        const PORT = parseInt(process.env.PORT as string, 10) || 8080
        this.app.listen(PORT, () => {
            logger.notice(`Server started on port: ${PORT}`)
        })
    }

    private config() {
        // Setup typedi dependency injection for controllers
        useContainer(Container)
        // Use the existing server
        useExpressServer(this.app, {
            controllers: [__dirname + "/controllers/*.ts"]
        })
    }

    private async loadEnvVars(): Promise<boolean> {
        // Environment variable setup (in production download this form storage bucket to avoid unwanted access to env vars)
        if (this.PRODUCTION_ENV) {
            const dotenv = await this.storageService.getDotenv(process.env.SECRETS_BUCKET as string)
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
}

new Server().start()
