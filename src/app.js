require('dotenv').config({ path: '../.env' });
const express = require('express');
const app = express();
require('../db/conn');
const route = require('../routes/route')
const cors = require("cors"); // Import the cors package

// Allow cross-origin requests for all routes
app.use(cors());

app.use(express.json())

app.use('/', route)

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(8000, () => {
    console.log('Listening on port 8000');
});