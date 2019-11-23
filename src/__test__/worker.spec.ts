import supertest from 'supertest'
import { Server } from '../server'
import { connect } from '../utils/db'
import { IPubSubBody } from '../interfaces/pubsub.interface'

describe('Worker microservice', () => {
    let app: Express.Application

    beforeAll(async () => {
        // Connect to test database and get express app
        await connect()
        app = new Server().app
    })

    describe('POST /work/', () => {
        it('should ack the request', async done => {
            // Construsct a valid pub/sub msg
            const validMessage: IPubSubBody = {
                message: {
                    messageId: 'id-test',
                    attributes: {
                        flowId: '',
                        triggerNode: ''
                    }
                },
                subscriptionId: 'subscription-test'
            }

            const response = await supertest(app)
                .post('/work/')
                .send(validMessage)

            // check the request ack-d
            expect(response.status).toBe(200)
            expect(response.body.success).toBe(true)

            done()
        })
    })
})
