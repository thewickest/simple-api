const express = require('express');
const fs = require('fs');
const Redis = require('ioredis');

const app = express();
const redis = new Redis();

app.use(express.json());

// /track
app.post('/track', async (req, res) => {
    const data = req.body;

    if (data.count) {
        try {
            await redis.incrby('count', data.count);
        } catch (err) {
            return res.status(500).send({ message: 'Error updating Redis count.' });
        }
    }

    fs.appendFile('./data.json', JSON.stringify(data) + '\n', (err) => {
        if (err) {
            return res.status(500).send({ message: 'Error while processsing the data' });
        } else {
            return res.status(200).send(data)
        }
    });
});

// /count
app.get('/count', async (req, res) => {
    try {
        const count = await redis.get('count');
        res.status(200).send({ count: parseInt(count, 10) || 0 });
    } catch (err) {
        res.status(500).send({ message: 'Error retrieving count from Redis.' });
    }
});


module.exports = app;
