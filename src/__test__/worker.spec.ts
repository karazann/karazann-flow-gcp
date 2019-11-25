/*!
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import supertest from 'supertest'
import { Server } from '../server'
import { connect } from '../utils/db'
import { IFlowData } from '../shared/flow/core/data'
import { IPubSubBody } from '../interfaces/pubsub.interface'

const mockedFile = {
    download: jest.fn()
}

const mockedBucket = {
    file: jest.fn(() => mockedFile)
}

const mockedStorage = {
    bucket: jest.fn(() => mockedBucket)
}

jest.mock('@google-cloud/storage', () => {
    return {
        Storage: jest.fn(() => mockedStorage)
    }
})

describe('Worker microservice', () => {
    let app: Express.Application

    beforeAll(async () => {
        // Connect to test database and get express app
        await connect()
        app = new Server().app
    })

    beforeEach(() => {
        mockedStorage.bucket.mockClear()
        mockedBucket.file.mockClear()
        mockedFile.download.mockClear()
    })

    describe('POST /work/', () => {
        
        const validMessage: IPubSubBody = {
            message: {
                messageId: 'id-test',
                attributes: {
                    flowId: 'test',
                    eventName: 'test',
                    eventData: {
                        data: 3213123
                    }
                }
            },
            subscriptionId: 'subscription-test'
        }

        it('should work if everything is fine', async done => {
            const validFlowData: IFlowData = {
                id: 'test@1.0.0',
                nodes: {
                    '1': {
                        id: 1,
                        data: {},
                        inputs: {},
                        outputs: {
                            act: {
                                connections: [
                                    { node: 2, input: 'act', data: {} }
                                ]
                            },
                            key: {
                                connections: [
                                    { node: 2, input: 'key', data: {} }
                                ]
                            }
                        },
                        position: [80, 200],
                        name: 'Timer'
                    },
                    '2': {
                        id: 2,
                        data: {},
                        inputs: {
                            act: {
                                connections: [
                                    { node: 1, output: 'act', data: {} }]
                                
                            },
                            key: {
                                connections: [
                                    { node: 1, output: 'key', data: {} }
                                ]
                            }
                        },
                        outputs: {},
                        position: [80, 400],
                        name: 'Print'
                    }
                }
            }

            // Setup mock return value
            mockedFile.download.mockResolvedValue([Buffer.from(JSON.stringify(validFlowData))])

            // Fire supertest
            const response = await supertest(app)
                .post('/work/')
                .send(validMessage)

            // Expect to be properly init the service
            expect(mockedStorage.bucket).toBeCalledWith(process.env.BUCKET_FLOWS)
            expect(mockedStorage.bucket).toBeCalledTimes(1)

            // Expect to be download the file from Cloud Storage
            expect(mockedBucket.file).toBeCalledWith('test')
            expect(mockedBucket.file).toBeCalledTimes(1)
            expect(mockedFile.download).toBeCalledTimes(1)

            // check the request ack-d
            expect(response.status).toBe(200)
            expect(response.body.success).toBe(true)

            done()
        })

        it('should fail properly if cant load the file', async done => {
            // Setup mock download to throw error
            mockedFile.download.mockRejectedValueOnce(new Error('file download failed'))

            // Fire supertest
            const response = await supertest(app)
                .post('/work/')
                .send(validMessage)

            // check return proper error code
            expect(response.status).toBe(409)

            done()
        })

        it.todo('should fail properly if the engine cant process the flow'/*, async done => {
            const invalidFlowData: IFlowData = {
                id: 'test@0.0.1',
                nodes: {
                    '1': {
                        id: 1,
                        data: {},
                        inputs: {},
                        outputs: {},
                        position: [80, 200],
                        name: 'Number'
                    }
                }
            }

            // Setup mock to download invalid flow data
            mockedFile.download.mockResolvedValue(Buffer.from(JSON.stringify(invalidFlowData)))

            // Fire supertest
            const response = await supertest(app)
                .post('/work/')
                .send(validMessage)

            // check return proper error code
            expect(response.status).toBe(409)

            done()
        }*/)
    })
})
