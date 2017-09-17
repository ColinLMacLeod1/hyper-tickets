const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const config = require('config');
const yes = require('yes-https');
const Sequelize = require('sequelize-cockroachdb');
const axios = require('axios');
const Client = require('coinbase').Client;

const app = express();

//Middleware
app.use(cors());
app.use(bodyParser.json());

//Constants
const blockchainUrl = config.get('Blockchain.url');
const codes = config.get('Presets.codes');
const dbConfig = config.get('Customer.dbConfig');
const port = config.get('Presets.port');
const saltRounds = 10;
console.log(port);

// Serve static files
app.use(express.static(path.join(__dirname, 'testDist')))

// Connect to CockroachDB
const sequelize = new Sequelize('test', 'root', '', dbConfig);

// Define the Ticket model for the tickets table
const Ticket = sequelize.define('tickets', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    ownerId: { type: Sequelize.STRING },
    title: { type: Sequelize.STRING },
    location: { type: Sequelize.STRING },
    price: { type: Sequelize.DECIMAL },
    type: { type: Sequelize.STRING },
    seat: { type: Sequelize.STRING }
});

// Define the User model for the accounts table
const User = sequelize.define('users', {
    username: { type: Sequelize.STRING, primaryKey: true },
    password: { type: Sequelize.STRING },
    displayName: { type: Sequelize.STRING },
    avatar: { type: Sequelize.STRING },
    coinCode: { type: Sequelize.STRING },
    coinId: { type: Sequelize.STRING },
    coinUsername: { type: Sequelize.STRING },
    coinName: { type: Sequelize.STRING },
    coinProfile: { type: Sequelize.STRING }
});

// Create the each table.
  // Tickets table
  Ticket.sync({force: true}).then(function() {
    // Insert two rows into the "accounts" table.

  }).catch(function(err) {
    console.error('error: ' + err.message);
  });
  // Users table
  User.sync({force: true}).then(function() {
    // Insert two rows into the "accounts" table.

  }).catch(function(err) {
    console.error('error: ' + err.message);
  });


// BUY Ticket
app.post('/api/buy', (req, res) => {
    // Blockchain shit goes here then ->
    //coinbase

    return Ticket.update({
            ownerId: req.body.ownerId
        }, {
            where: {
                id: req.body.id
            }
        })
        .then(() => {
            return Ticket.findOne({
                where: {
                    id: req.body.id
                }
            })
        })
        .then((result) => {
            if (!result) {
                return res.status(404).send('Ticket does not exist')
            } else if (result.ownerId === req.body.ownerId) {
                console.log('Transaction Complete');
                const url = `${blockchainUrl}tickets/${req.body.id}`;
                console.log(url);
                return axios.put(url, { ownerId: req.body.ownerId })
                    .then(response => res.send('On the chain - transaction'));
            } else {
                return res.status(400).send('Transaction Incomplete')
            }
        })
        .catch((err) => {
            console.error(err);
            res.send(err);
        });
});

// CREATE Ticket
app.post('/api/create', (req, res) => {
    let newid;
    Ticket.max('id').then((result) => {
        if (isNaN(result)) {
            newid = 0;
        } else {
            newid = result + 1;
        }
        // ADD TO BLOCKCHAIN HERE .then ->
        Ticket.create({
            id: newid,
            ownerId: req.body.ownerId,
            title: req.body.title,
            location: req.body.location,
            price: req.body.price,
            type: req.body.type,
            seat: req.body.seat
        }).then(() => {
                Ticket.findAndCountAll({
                    where: {
                        id: newid
                    }
                }).then((result) => {
                    if (result.count === 0) {
                        console.log('Ticket not saved')
                        res.send('Ticket not Saved')
                    } else if (result.count === 1) {
                        console.log('Ticket saved')
                        // res.send('Ticket Saved')
                    }
                }).catch((err) => {
                    res.send(err)
                    console.log(err)
                })
            })
            .then(() => {
                console.log('Saving to the Blockchain');
                const url = `${blockchainUrl}tickets`;
                return axios.post(url, {
                    id: String(newid),
                    ownerId: req.body.ownerId
                });
            })
            .then(response => {
                res.send('On the chain');
            })
            .catch((err) => {
                if (err.name == 'SequelizeUniqueConstraintError') {
                    console.log('Ticket already exists')
                    res.send('Ticket already exists')
                } else {
                    // res.send(err)
                    res.end();
                    console.error(err);
                }
            })
    }).catch((err) => {
        console.error(err);
        res.send(err);
    })
});

// EDIT Ticket
app.post('/api/edit', (req, res) => {
    Ticket.findOne({
        where: {
            id: req.body.id
        }
    }).then((result) => {
        var newTicket = Object.assign({}, result.dataValues, req.body)
        Ticket.update({
            ownerId: newTicket.ownerId,
            title: newTicket.title,
            location: newTicket.location,
            price: Number(newTicket.price),
            type: newTicket.type,
            seat: newTicket.seat
        }, {
            where: {
                id: req.body.id
            }
        }).then((result) => {
                res.send('Updated')
            })
            .catch((err) => {
                res.send(err)
                console.log(err)
            })
    }).catch((err) => {
        res.send(err)
        console.log(err)
    })
})

// DELETE Ticket
app.post('/api/delete', (req, res) => {
    // Blockchain confirmation .then ->
    Ticket.destroy({
        where: {
            id: req.body.id
        }
    }).then(() => {
        Ticket.findOne({
            where: {
                id: req.body.id
            }
        }).then((result) => {
            if (!result) {
                res.send('Ticket deleted')
                conosle.log('Ticket deleted')
            } else {
                res.send('Ticket not deleted')
                conosle.log('Ticket not deleted')
            }
        })
    }).catch((err) => {

    })
})

// LOGIN
app.post('/api/login', (req, res) => {
    User.findOne({
        where: {
            username: req.body.username,
            password: req.body.password
        }
    }).then((result) => {
        console.log(result)
        if (!result) {
            res.send(false)
        } else {
            res.send(result)
        }
    }).catch((err) => {
        res.send(err)
        console.log(err)
    })
})

// SIGNUP
app.post('/api/signup', (req, res) => {
    User.create({
        username: req.body.username,
        displayName: req.body.displayName,
        password: req.body.password
    }).then(() => {
        console.log('User Signed Up')
        res.send('User Signed Up')
    }).catch((err) => {
        if (err.name == 'SequelizeUniqueConstraintError') {
            console.log('User already exists')
            res.send('User already exists')
        } else {
            res.send(err)
            console.log(err)
        }
    })
    //No confirmation yet
})

// User info
app.get('/api/user/:username', (req, res) => {
    User.findOne({
        where: {
            username: req.params.username
        }
    }).then((result) => {
        console.log('User Found')
        res.send(JSON.stringify(result))
    }).catch((err) => {
        res.send(err)
        console.log(err)
    })
})

// SEARCH
app.post('/api/search', (req, res) => {
    if (true) {
        Ticket.findAll({
            where: {
                title: {
                    $iLike: '%' + req.body.search + '%'
                }
            }
        }).then((result) => {
            if (result) {
                res.send(result)
            } else {
                res.send(null)
            }
        }).catch((err) => {
            res.send(err)
            console.log(err)
        })
    }
})

// GET 50 recent tickets
app.get('/api/ticketlist', (req, res) => {
    Ticket.findAll({
        order: [['id', 'DESC']],
        limit: 20
    }).then((result) => {
        if (!result) {
            res.send('No tickets exist')
        } else {
            res.send(JSON.stringify(result))
        }
    }).catch((err) => {
        console.log(err)
        res.send(err)
    })

})

// GET single ticket
app.get('/api/ticket/:id', (req, res) => {
    Ticket.findOne({
        where: {
            id: req.params.id
        }
    }).then((result) => {
        res.send(JSON.stringify(result))
    }).catch((err) => {
        res.send(err)
    })
})

// GET coinbase
app.get('/api/coincode/', (req, res) => {
    var user = req.query.state;
    axios.post('https://api.coinbase.com/oauth/token', {
        grant_type: "authorization_code",
        code: req.query.code,
        client_id: "f1bb82513c4093f5e22d6d9c7002c6bb192edd597513f661e047b39cb7b8db3e",
        client_secret: "0f3cd06de247ba1e9f731ad34df9385e2ef41293a0d277274b21fb4fee4d4dd7",
        redirect_uri: "https://hyper-tickets.appspot.com/api/coincode/"
    }).then((response) => {
        User.update({
            coinCode: response.data.access_token,
            coinName: response.data.refresh_token
        }, {
            where: {
                username: user
            }
        }).catch((err) => {
            console.log(err)
        })
        axios.get('https://api.coinbase.com/v2/user', {
            headers: {
                Authorization: 'Bearer ' + response.data.access_token
            }
        }).then((resdata) => {
            console.log(resdata.data)
            User.update({
                    avatar: resdata.data.data.avatar_url,
                    coinId: resdata.data.data.id,
                    coinUsername: resdata.data.data.username,
                    displayName: resdata.data.data.name,
                    coinProfile: resdata.data.data.profile_url
                },
                {
                    where: {
                        username: user
                    }
                })
            res.send(JSON.stringify(resdata.data))
        }).catch((err) => {

        })

    }).catch((err) => {
        console.log(err)
        res.send(JSON.stringify(err))
    })
})

// Coin exchange
app.post('/api/pay', (req, res) => {
    var payInfo = { amount: req.body.amount }
    User.findOne({
        where: {
            username: req.body.to
        }
    }).then((to) => {
        payInfo.to = to.coinId;
        User.findOne({
            where: {
                username: req.body.from
            }
        }).then((from) => {
            payInfo.from = from.coinId
            payInfo.access = from.coinCode
            payInfo.refresh = from.coinName

        })
    })
})

// test
app.get('/test', (req, res) => {
    console.log('test')
    res.send("test")
})

// Catch all Handler
/*
app.get('*', (req,res)=>{
  res.sendFile(path.join(__dirname,'testDist/index.html'))
})
*/
// Server Port
app.listen(process.env.PORT || port, () => {
    console.log('App listening on port', process.env.PORT || port)
})
module.exports = app;
