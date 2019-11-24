import supertest from 'supertest'
import { Server } from '../server'
import { connect } from '../utils/db'
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
        it('should ack the request', async done => {
            // Construsct a valid pub/sub msg
            const validMessage: IPubSubBody = {
                message: {
                    messageId: 'id-test',
                    attributes: {
                        flowId: 'test',
                        triggerNode: '123'
                    }
                },
                subscriptionId: 'subscription-test'
            }

            const response = await supertest(app)
                .post('/work/')
                .send(validMessage)

            // Expect to be properly init the service
            // expect(mockedStorage.bucket).toBeCalledWith(process.env.BUCKET_FLOWS)
            // expect(mockedStorage.bucket).toBeCalledTimes(1)

            // Expect to be download the file from Cloud Storage
            // expect(mockedBucket.file).toBeCalledWith('test')
            // expect(mockedBucket.file).toBeCalledTimes(1)
            // expect(mockedFile.download).toBeCalledTimes(1)

            // check the request ack-d
            expect(response.status).toBe(200)
            expect(response.body.success).toBe(true)

            done()
        })
    })
})
