'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const ledgerRouter = require('./router');

const app = express();

const port = 8080;

app.use(bodyParser.json());
app.use('/tickets', ledgerRouter);

app.listen(port, () => console.log(`Bitcoin server running on localhost:${port}`));

