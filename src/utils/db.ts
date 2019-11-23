/**
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import { createConnection, getConnection, ConnectionOptions, Connection } from 'typeorm'
import { logger } from './logger'
import { Trigger } from '../shared/trigger'

/** Connection options for development/testing/production */
const config = (): ConnectionOptions => {
    return {
        /** Defaults */
        name: 'default',
        type: 'postgres',
        host: '127.0.0.1',
        port: 3306,
        database: process.env.DB_DATABASE,
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        entities: [Trigger],
        synchronize: true,
        cache: true,
        logging: false,

        /** Development Mode */
        ...(process.env.NODE_ENV === 'development' && {
            port: 5432
        }),
        
        /** Testing Mode */
        ...(process.env.NODE_ENV === 'test' && {
            port: 5432,
            dropSchema: true
        }),

        /** Production Mode */
        ...(process.env.NODE_ENV === 'production' && {
            synchronize: false,
            extra: {
                host: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`
            }
        })
    }
}

/**
 * Connect to PostgreSQL database
 * @return Return connection if conncted successfully else return null
 */
export const connect = async () => {
    let connection: Connection | null = null

    
    try {
        connection = getConnection(config().name)
        logger.notice('DB connection found.')
    } catch (e) {
        try {
            logger.notice('DB connection not found creating new one.')
            connection = await createConnection(config())
            logger.notice('DB connection created.')
        } catch (e) {
            logger.emerg(`Failed to create connection as user: ${process.env.DB_USER}`)
            logger.error(e.message)
        }
    }

    return connection
}
