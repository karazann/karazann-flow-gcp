/**
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import 'reflect-metadata'

import { loadEnv } from './utils/config'
loadEnv()

import { logger } from './utils/logger'
import { connect } from './utils/db'

import express from 'express'
import { Container } from 'typedi'

import { json, urlencoded } from 'body-parser'
import { useContainer, useExpressServer } from 'routing-controllers'

export class Server {
    public app: express.Application = express()

    constructor() {  
        this.config()
    }

    /**
     * Starts the application at given port
     * @param port Port to use when start the application
     */
    public async start(port: number) {
        await connect()
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
            controllers: [__dirname + '/controllers/**/*.controller.js', __dirname + '/controllers/*.ts']
        })
    }
}
