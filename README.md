# Hyper Tickets

## Front-End
- [ ] Allow visitor/user to browse tickets
- [ ] Allow user to buy tickets
- [ ] Allow user to host tickets

## Back-End
- [ ] API
    - [ ] BUY Ticket
    - [ ] CREATE Ticket
    - [ ] EDIT Ticket
    - [ ] DELETE Ticket
    - [ ] GET User data
      - [ ] Name
      - [ ] Tickets
    - [ ] LOGIN
- [ ] Square for payments

## DB
- [ ] Store User data (auth)

## Chain Code (Zack)
- [ ] Store transactions for tickets

## Hyper-Tickets api

#### Models

1. Tickets  
id: { type: Sequelize.INTEGER, primaryKey: true },  
ownerId: { type: Sequelize.STRING },  
title: {type: Sequelize.STRING},  
location: {type: Sequelize.STRING},  
price: {type: Sequelize.DECIMAL},  
type: {type: Sequelize.STRING},  
seat: {type: Sequelize.STRING}  

2. Users  
username: { type: Sequelize.STRING, primaryKey: true },  
password: { type: Sequelize.STRING },  
displayName: { type: Sequelize.STRING },  
avatar: {type: Sequelize.STRING}   

|Endpoint          |Params             |Returns         |Method|
| --- | --- | --- | --- |
|/api/ticket/:id   |id        |Ticket (object) |GET|
|/api/tickelist|None|Recent 20 tickets(array)|GET|
|/api/user/:username|username|User (object)|GET|
|/api/signup|username, displayName, password (strings)|String result|POST|
|/api/login|username, password (string)|User (object) or FALSE|POST|
|/api/delete|id (integer)|String result|POST|
|/api/create|owner,title,location,price(decimal),type,seat|String result|POST|
|/api/buy|ownerId(purchaser),id(integer)|String result|POST|
|/api/edit|<parameter(s) to change>,id(required)|'Updated' or err|POST|
