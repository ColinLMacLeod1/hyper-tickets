const express = require('express')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const config = require('config')
const yes = require('yes-https')
const Sequelize = require('sequelize-cockroachdb')

const app = express()

//Middleware
app.use(cors())
app.use(bodyParser.json())

//Constants
const dbConfig = config.get('Customer.dbConfig');
const saltRounds = 10;
const codes = config.get('Presets.codes');
const port = config.get('Presets.port')
console.log(port)


// Connect to CockroachDB
var sequelize = new Sequelize('test', 'root', '', dbConfig);

// Define the Account model for the "accounts" table.
var Account = sequelize.define('accounts', {
  id: { type: Sequelize.INTEGER, primaryKey: true },
  balance: { type: Sequelize.INTEGER },
  text: {type: Sequelize.STRING}
});

// Define

// Create the "accounts" table.
Account.sync({force: false}).then(function() {
  // Insert two rows into the "accounts" table.
  /*
  return Account.bulkCreate([
    {id: 1, balance: 1000},
    {id: 2, balance: 250}
  ]);
  */
}).then(function() {
  // Retrieve accounts.
  return Account.findAll();
}).then(function(accounts) {
  // Print out the balances.
  accounts.forEach(function(account) {
    console.log(account.id + ' ' + account.balance);
  });
}).catch(function(err) {
  console.error('error: ' + err.message);
});

// BUY Ticket
app.post('/api/buy', function(req,res){

})

// CREATE Ticket
app.post('/api/create', function(req,res){

})

// EDIT Ticket
app.post('/api/edit', function(req,res){

})

// DELETE Ticket
app.post('/api/delete', function(req,res){

})

// LOGIN
app.post('/api/login', function(req,res){

})

// USER
app.post('/api/user', function(req,res){
  console.log(req.body.text)
  Account.bulkCreate([
    {id: req.body.id, text: req.body.text}
  ])
  res.send(JSON.stringify(req.body.text))
})



// test
app.get('/test', function(req,res){
  console.log('test')
  res.send("test")
})

// Server Port
app.listen(process.env.PORT || port,function() {
	console.log('App listening on port', process.env.PORT || port)
})
module.exports = app;
