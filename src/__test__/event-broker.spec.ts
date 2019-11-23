import request from 'supertest'
import { Server } from '../server'
import { connect } from '../utils/db'
import { logger } from '../utils/logger'
import { IPubSubBody } from '../interfaces/pubsub.interface'
import { Trigger } from '../shared/trigger'
import { Topic } from '@google-cloud/pubsub'

describe('Event Broker microservice', () => {
    let app: Express.Application
    let savedEnv: any

    const publishMock = jest.fn().mockReturnValue(Promise.resolve())

    beforeAll(async () => {
        // save current env vars
        savedEnv = process.env

        // Setup env vars for testing
        process.env.DB_USER = 'postgres'
        process.env.DB_PASSWORD = 'root'
        process.env.DB_DATABASE = 'karazann-test'
        process.env.TOPIC_JOBS = 'jobs-test'

        // Silence winston
        logger.silent = true

        // Connect to test database and get express app
        await connect()
        app = new Server().app

        // Mock the PubSub publish method with jest.fn()
        Topic.prototype.publish = publishMock
    })

    beforeEach(() => {
        publishMock.mockClear()
    })

    afterAll(() => {
        // restore env vars
        process.env = savedEnv
    })

    describe('POST /event/', () => {
        it('should work if send valid PubSub message', async done => {
            // Seed the database with test triggers
            const trigger1 = new Trigger()
            trigger1.flowId = 'id'
            trigger1.triggerNode = '1'
            trigger1.eventName = 'event1'
            await trigger1.save()

            const trigger2 = new Trigger()
            trigger2.flowId = 'id'
            trigger2.triggerNode = '1'
            trigger2.eventName = 'event1'
            await trigger2.save()

            const trigger3 = new Trigger()
            trigger3.flowId = 'id'
            trigger3.triggerNode = '1'
            trigger3.eventName = 'event2'
            await trigger3.save()

            // Construsct a valid pub/sub msg
            const pubsubPush: IPubSubBody = {
                message: {
                    messageId: 'id-test',
                    attributes: {
                        eventName: 'event1'
                    }
                },
                subscriptionId: 'subscription-test'
            }

            // Run supertest request
            const response = await request(app)
                .post('/event/')
                .send(pubsubPush)

            const buffer = Buffer.from(
                JSON.stringify({
                    flowId: 'id',
                    triggerNode: '1'
                })
            )

            // Should call PubSub publish with right data and expected number
            expect(publishMock).toHaveBeenNthCalledWith(1, buffer)
            expect(publishMock).toHaveBeenNthCalledWith(2, buffer)
            expect(publishMock).toBeCalledTimes(2)

            // Should ack the msg
            expect(response.status).toBe(200)
            expect(response.body.success).toBe(true)

            // And finally we are done
            done()
        })

        it('should respond with 400 BadRequest when attributes is wrong', async done => {
            // Construct invalid pub/sub body
            const pubsubPush: IPubSubBody = {
                message: {
                    messageId: 'id-test'
                },
                subscriptionId: 'subscription-test'
            }

            // Run supertest
            const response = await request(app)
                .post('/event/')
                .send(pubsubPush)

            // Should return bad request
            expect(response.status).toBe(400)

            done()
        })
    })
})

// '{message: { "messageId": "id-test", "attributes": { "eventName": "test" }}'
