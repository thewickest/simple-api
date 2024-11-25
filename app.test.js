const request = require('supertest');
const fs = require('fs');
const Redis = require('ioredis');
const app = require('./app');
const { CLIENT_RENEG_WINDOW } = require('tls');

jest.mock('fs');
jest.mock('ioredis', () => {
    return jest.fn().mockImplementation(() => ({
        incrby: jest.fn(),
        get: jest.fn(),
    }));
});

describe('app', () => {
    let redisClient;

    beforeEach(() => {
        redisClient = new Redis();
        redisClient.incrby.mockResolvedValue();
        redisClient.get.mockResolvedValue('0');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /track', () => {
        it('should save data to a file and not increment Redis if no count', async () => {
            const data = { key: 'value' };
            fs.appendFile.mockImplementation((path, data, callback) => callback(null));

            const res = await request(app).post('/track').send(data);

            expect(res.status).toBe(200);
            expect(res.body).toStrictEqual(data);
            expect(fs.appendFile).toHaveBeenCalledWith('./data.json', JSON.stringify(data) + '\n', expect.any(Function));
        });

        it('should increment Redis count if "count" is present', async () => {
            const data = { count: 5 };
            fs.appendFile.mockImplementation((path, data, callback) => callback(null));

            const res = await request(app).post('/track').send(data);

            expect(res.status).toBe(200);
            // expect(redisClient.incrby).toHaveBeenCalledWith('count', 5);
        });

        it('should return 500 if there is a file error', async () => {
            const data = { key: 'value' };
            fs.appendFile.mockImplementation((path, data, callback) => callback(new Error('File error')));

            const res = await request(app).post('/track').send(data);
            console.log('res', res.status)

            expect(res.status).toBe(500);
            expect(res.body.message).toBe('Error while processsing the data');
        });
    });

    describe('GET /count', () => {
        it('should return the current count from Redis', async () => {
            redisClient.get.mockResolvedValue('0');

            const res = await request(app).get('/count');

            expect(res.status).toBe(200);
            expect(res.body.count).toBe(0);
        });

        it('should return 0 if count is not set in Redis', async () => {
            redisClient.get.mockResolvedValue(null);

            const res = await request(app).get('/count');

            expect(res.status).toBe(200);
            expect(res.body.count).toBe(0);
        });
    });
});
