/*!
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import { loadEnv } from '../config'

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

describe('Config util', () => {
    it('should setup envs in prod env correnctly if no error', async done => { 
        process.env.NODE_ENV = 'production'
        
        // Mock download data
        const validDotenvData = `
            DB_USER='user'
            DB_PASS='pass'
        `
        const buffer = Buffer.from(validDotenvData)
        mockedFile.download.mockResolvedValueOnce([buffer])

        const success = await loadEnv()
        
        // Expecting to return true if everything is ok
        expect(success).toBe(true)

        // Expecting to setup envs correctly
        expect(process.env.DB_USER).toBe('user')
        expect(process.env.DB_PASS).toBe('pass')

        done()
    })

    it('should return false if failed to setup env vars in prod', async done => { 
        process.env.NODE_ENV = 'production'
        
        // Mock download data
        mockedFile.download.mockRejectedValueOnce(new Error('Download error'))

        const success = await loadEnv()
        
        // Expecting to return true if everything is ok
        expect(success).toBe(false)

        done()
    })
})
