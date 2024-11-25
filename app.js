const express = require('express');
const app = express();

app.use(express.json());

// /test
app.get('/test', async (req, res) => {
    res.status(200).send({ data: 'test' });
});

module.exports = app;
