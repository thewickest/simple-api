const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());

// /track
app.post('/track', async (req, res) => {
    const data = req.body;

    fs.appendFile('./data.json', JSON.stringify(data) + '\n', (err) => {
        if (err) {
            return res.status(500).send({ message: 'Error while processsing the data' });
        }
    });

    res.status(200).send(data);
});


module.exports = app;
