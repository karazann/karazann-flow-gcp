/**
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import 'reflect-metadata'

import { loadEnv } from './config'
loadEnv()

import { logger } from './logger'
import { connect } from './db'

import express from 'express'
import { Container } from 'typedi'

import { json, urlencoded } from 'body-parser'
import { useContainer, useExpressServer } from 'routing-controllers'

class Server {
    private app: express.Application

    constructor() {
        this.app = express()
    }
    
    /**
     * Starts the application at given port
     * @param port Port to use when start the application
     */
    public async start(port: number) {
        await connect()
        this.config()
        this.app.listen(port, () => {
            logger.notice(`Server started on port: ${port}`)
        })
    }

    /**
     *  Setup body parsing, typedi container and routing-controllers
     */
    private config() {
        this.app.use(json())
        this.app.use(urlencoded({ extended: true }))

        useContainer(Container)

        useExpressServer(this.app, {
            controllers: [__dirname + '/controllers/*.js', __dirname + '/controllers/*.ts']
        })
    }
}

new Server().start(8080 || process.env.PORT)
