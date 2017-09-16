const express = require('express')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const config = require('config')
const yes = require('yes-https')
const Sequelize = require('sequelize-cockroachdb');

const app = express()

//Middleware
app.use(cors())
app.use(bodyParser.json())

//Constants
const dbConfig = config.get('Customer.dbConfig');
const saltRounds = 10;
const codes = config.get('Presets.codes');
const port = config.get('Presets.port')


// Connect to CockroachDB
var sequelize = new Sequelize('bank', 'maxroach', '', dbConfig);


// Server Port
app.listen(process.env.PORT || port,function() {
	console.log('App listening on port', port)
})
module.exports = app;
