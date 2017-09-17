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
const sequelize = new Sequelize('test', 'root', '', dbConfig);

// Define the Ticket model for the tickets table
const Ticket = sequelize.define('tickets', {
  id: { type: Sequelize.INTEGER, primaryKey: true },
  owner: { type: Sequelize.STRING },
  title: {type: Sequelize.STRING},
  location: {type: Sequelize.STRING},
  price: {type: Sequelize.DECIMAL},
  type: {type: Sequelize.STRING},
  seat: {type: Sequelize.STRING}
});

// Define the User model for the accounts table
const User = sequelize.define('users', {
  username: { type: Sequelize.STRING, primaryKey: true },
  password: { type: Sequelize.STRING },
  displayName: { type: Sequelize.STRING },
  avatar: {type: Sequelize.STRING}
});

// Create the each table.
if(process.env.UPDATETABLES){
  // Tickets table
  Ticket.sync({force: true}).then(function() {
    // Insert two rows into the "accounts" table.
    Ticket.bulkCreate([
      {id: 1}
    ]);
  }).catch(function(err) {
    console.error('error: ' + err.message);
  });
  // Users table
  User.sync({force: true}).then(function() {
    // Insert two rows into the "accounts" table.
    User.bulkCreate([
      {username: "test"}
    ]);
  }).catch(function(err) {
    console.error('error: ' + err.message);
  });
}


// BUY Ticket
app.post('/api/buy', (req,res)=>{
  // Blockchain shit goes here then ->
  Ticket.update({
    owner: req.body.owner
  }, {
    where: {
      id:req.body.id
    }
  }).then(()=>{
    Ticket.findOne({
      where: {
        id:req.body.id
      }
    }).then((result)=>{
      if(!result){
        res.send('Ticket does not exist')
      } else if(result.owner==req.body.owner){
        res.send('Transaction Complete')
      } else {
        res.send('Transaction Incomplete')
      }
    }).catch((err)=>{
      console.log(err)
      res.send(err)
    })
  }).catch((err)=>{
    console.log(err)
    res.send(err)
  })
})

// CREATE Ticket
app.post('/api/create', (req,res)=>{
  Ticket.max('id').then((result)=>{
    var newid = result+1;
    // ADD TO BLOCKCHAIN HERE .then ->
    Ticket.create({
      id: newid,
      owner: req.body.owner,
      title: req.body.title,
      location: req.body.location,
      price: req.body.price,
      type: req.body.type,
      seat: req.body.seat
    }).then(() => {
      Ticket.findAndCountAll({
        where:{
          id: newid
        }}).then((result)=>{
          if(result.count==0){
            console.log('Ticket not saved')
            res.send('Ticket not Saved')
          } else if(result.count==1){
            console.log('Ticket saved')
            res.send('Ticket Saved')
          }
      }).catch((err)=>{
          res.send(err)
          console.log(err)
      })
    }).catch((err)=>{
      if(err.name=='SequelizeUniqueConstraintError'){
        console.log('Ticket already exists')
        res.send('Ticket already exists')
      } else {
        res.send(err)
        console.log(err)
      }
    })
  }).catch((err)=>{
    res.send(err)
    console.log(err)
  })
})

// EDIT Ticket
app.post('/api/edit', (req,res)=>{

})

// DELETE Ticket
app.post('/api/delete', (req,res)=>{
  // Blockchain confirmation .then ->
  Ticket.destroy({
    where: {
      id: req.body.id
    }
  }).then(()=>{
    Ticket.findOne({
      where: {
        id: req.body.id
      }
    })
  }).catch((err)=>{

  })
})

// LOGIN
app.post('/api/login', (req,res)=>{
  User.findOne({
    where: {
      username: req.body.username,
      password: req.body.password
    }
  }).then((result)=>{
    console.log(result)
    if(!result){
      res.send(false)
    } else {
      res.send(true)
    }
  }).catch((err)=>{
    res.send(err)
    console.log(err)
  })
})

// SIGNUP
app.post('/api/signup', (req,res)=>{
  User.create({
    username: req.body.username,
    displayName: req.body.displayName,
    password: req.body.password
  }).catch((err)=>{
    if(err.name=='SequelizeUniqueConstraintError'){
      console.log('User already exists')
      res.send('User already exists')
    } else {
      res.send(err)
      console.log(err)
    }
  })
  //No confirmation yet
})

// SEARCH


// GET 50 recent tickets
app.get('/api/recenttickets', (req,res)=>{

})

// GET single ticket
app.get('/api/ticket/:id', (req,res)=>{
  Ticket.findOne({
    where:{
      id:req.params.id
    }
  }).then((result)=>{
    console.log(result)
    res.send(JSON.stringify(result))
  }).catch((err)=>{
    console.log(err)
    res.send(err)
  })
})


// test
app.get('/test', (req,res)=>{
  console.log('test')
  res.send("test")
})

// Server Port
app.listen(process.env.PORT || port,()=>{
	console.log('App listening on port', process.env.PORT || port)
})
module.exports = app;
