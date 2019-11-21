import request from 'supertest'
import { Server } from '../server'
import { connect } from '../utils/db'
import { logger } from '../utils/logger'
import { IPubSubMessage, IPubSubBody } from '../interfaces/pubsub.interface'

describe('Event Broker microservice', () => {
    const OLD_ENV = process.env
    let app: Express.Application

    beforeAll(async () => {
        // Setup env vars for testing
        process.env.DB_USER = 'postgres'
        process.env.DB_PASSWORD = 'root'
        process.env.DB_DATABASE = 'karazann-test'

        // Silence winston
        logger.silent = true

        // Get express app and connect to test database
        app = new Server().app
        await connect()
    })

    afterAll(() => {
        // Reset the env vars to default
        process.env = OLD_ENV
    })

    describe('POST /event/user', () => {
        it('should work if send valid PubSub message', done => {
            const pubsubPush: IPubSubBody = {
                message: {
                    messageId: 'id-test',
                    data: { test: 123 }
                },
                subscriptionId: 'subscription-test'
            }

            request(app)
                .post('/event/user')
                .send(pubsubPush)
                .expect(200)
                .expect({ status: 'success' })
                .end((err, res) => {
                    if (err) done(err)
                    done()
                })

            expect(true).toBe(true)
        })
    })
})
