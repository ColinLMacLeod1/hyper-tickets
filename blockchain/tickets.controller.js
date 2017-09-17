const hfc = require('fabric-client');
const path = require('path');
const util = require('util');

const ledgerController = {
    createTicket,
    getTicketHistory,
    listAllTickets,
    transferTicket
};

module.exports = ledgerController;

const OPTIONS = {
    walletPath: path.join(__dirname, './creds'),
    userId: 'PeerAdmin',
    channelId: 'mychannel',
    chaincodeId: 'hyper-tickets',
    peerUrl: 'grpc://localhost:7051',
    eventUrl: 'grpc://localhost:7053',
    ordererUrl: 'grpc://localhost:7050'
};

function createTicket(req, res, next) {
    const { id, ownerId } = req.body;

    const client = new hfc();
    let txId = null;
    let channel = {};
    return _initialize(client)
        .then(ch => {
            channel = ch;
            txId = client.newTransactionID();
            console.log("Assigning transaction_id: ", txId._transaction_id);
            const request = {
                chaincodeId: OPTIONS.chaincodeId,
                fcn: 'createTicket',
                args: [id, ownerId],
                txId
            };
            return channel.sendTransactionProposal(request);
        })
        .then(response => {
            const proposalResponses = response[0];
            const proposal = response[1];
            const header = response[2];
            let isProposalGood = false;
            if (proposalResponses && proposalResponses[0].response &&
                proposalResponses[0].response.status === 200) {
                isProposalGood = true;
                console.log('transaction proposal was good');
            } else {
                console.error('transaction proposal was bad');
            }
            if (isProposalGood) {
                console.log(util.format(
                    'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
                    proposalResponses[0].response.status, proposalResponses[0].response.message,
                    proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature));
                const request = {
                    proposalResponses: proposalResponses,
                    proposal: proposal,
                    header: header
                };
                // set the transaction listener and set a timeout of 30sec
                // if the transaction did not get committed within the timeout period,
                // fail the test
                const transactionId = txId.getTransactionID();
                const eventPromises = [];
                let eventHub = client.newEventHub();
                eventHub.setPeerAddr(OPTIONS.eventUrl);
                eventHub.connect();

                let txPromise = new Promise((resolve, reject) => {
                    let handle = setTimeout(() => {
                        eventHub.disconnect();
                        reject();
                    }, 30000);

                    eventHub.registerTxEvent(transactionId, (tx, code) => {
                        clearTimeout(handle);
                        eventHub.unregisterTxEvent(transactionId);
                        eventHub.disconnect();

                        if (code !== 'VALID') {
                            console.error(
                                'The transaction was invalid, code = ' + code);
                            reject();
                        } else {
                            console.log(
                                'The transaction has been committed on peer ' +
                                eventHub._ep._endpoint.addr);
                            resolve();
                        }
                    });
                });
                eventPromises.push(txPromise);
                const sendPromise = channel.sendTransaction(request);
                return Promise.all([sendPromise].concat(eventPromises))
                    .then((results) => {
                        console.log(' event promise all complete and testing complete');
                        return results[0]; // the first returned value is from the 'sendPromise' which is from the
                                           // 'sendTransaction()' call
                    })
                    .catch(err => {
                        console.error(
                            'Failed to send transaction and get notifications within the timeout period.'
                        );
                        return 'Failed to send transaction and get notifications within the timeout period.';
                    });
            } else {
                console.error(
                    'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...'
                );
                return 'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...';
            }
        })
        .then(response => {
            if (response.status === 'SUCCESS') {
                console.log('Successfully sent transaction to the orderer.');
                return txId.getTransactionID();
            } else {
                console.error('Failed to order the transaction. Error code: ' + response.status);
                return 'Failed to order the transaction. Error code: ' + response.status;
            }
        })
        .catch(err => {
            res.status(400).send(`Caught Error ${err}`);
        });
}

function getTicketHistory(req, res, next) {
    const { id: ticketId }  = req.params;

    const client = new hfc();
    let channel = {};
    return _initialize(client, channel)
        .then(channel => {
            const request = {
                chaincodeId: OPTIONS.chaincodeId,
                txId: client.newTransactionID(),
                fcn: 'getTicketHistory',
                args: [ticketId]
            };
            return channel.queryByChaincode(request);
        })
        .then(response => {
            res.status(200).send(_formatHistory(ticketId, JSON.parse(response)));
        })
        .catch(err => {
            res.status(400).send(`Caught Error ${err}`);
        });
}

function _formatHistory(ticketId, transactions) {
    return {
        ticketId,
        transactions: transactions.map(transaction => ({
            isDelete: transaction.isDelete,
            timestamp: _formatTimestamp(transaction.timestamp),
            transactionId: transaction.txId,
            value: transaction.value
        }))
    }
}

function _formatTimestamp(timestamp) {
    const timestampPieces = JSON.parse(`{${
        timestamp.trim().replace(' ', ',').replace(/([a-z]+)/g, '"$1"')
    }}`);
    const { nanos, seconds } = timestampPieces;
    const milliseconds = (seconds * 1000) + (nanos / 1000);
    return milliseconds;
}

function listAllTickets(req, res, next) {
    const client = new hfc();
    let channel = {};
    return _initialize(client, channel)
        .then(channel => {
            console.log('Make query');
            const request = {
                chaincodeId: OPTIONS.chaincodeId,
                txId: client.newTransactionID(),
                fcn: 'queryAllTickets',
                args: ['']
            };
            return channel.queryByChaincode(request);
        })
        .then(response => {
            const tickets = JSON.parse(response).reduce((accum, ticket) => {
                const id = ticket.key;
                const { ownerId } = ticket.value;
                return Object.assign({}, accum, { [id]: { id, ownerId } });
            }, {});
            console.log('Returned from query');
            if (!response.length) {
                console.log('No payloads were returned from query');
            } else {
                console.log(`Query result count = ${Object.keys(tickets).length}`)
            }
            if (response[0] instanceof Error) {
                console.error(`Error from query = ${tickets[0]}`);
            }
            res.status(200).send(tickets);
        })
        .catch(err => {
            res.status(400).send(`Caught Error ${err}`);
        });
}

function transferTicket(req, res, next) {
    const { id: ticketId } = req.params;
    const { ownerId } = req.query;

    const client = new hfc();
    let txId = null;
    let channel = {};
    return _initialize(client)
        .then(ch => {
            channel = ch;
            txId = client.newTransactionID();
            console.log("Assigning transaction_id: ", txId._transaction_id);
            const request = {
                chaincodeId: OPTIONS.chaincodeId,
                fcn: 'changeTicketOwner',
                args: [ticketId, ownerId],
                txId
            };
            return channel.sendTransactionProposal(request);
        })
        .then(response => {
            const proposalResponses = response[0];
            const proposal = response[1];
            const header = response[2];
            let isProposalGood = false;
            if (proposalResponses && proposalResponses[0].response &&
                proposalResponses[0].response.status === 200) {
                isProposalGood = true;
                console.log('transaction proposal was good');
            } else {
                console.error('transaction proposal was bad');
            }
            if (isProposalGood) {
                console.log(util.format(
                    'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
                    proposalResponses[0].response.status, proposalResponses[0].response.message,
                    proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature));
                const request = {
                    proposalResponses: proposalResponses,
                    proposal: proposal,
                    header: header
                };
                // set the transaction listener and set a timeout of 30sec
                // if the transaction did not get committed within the timeout period,
                // fail the test
                const transactionId = txId.getTransactionID();
                const eventPromises = [];
                let eventHub = client.newEventHub();
                eventHub.setPeerAddr(OPTIONS.eventUrl);
                eventHub.connect();

                let txPromise = new Promise((resolve, reject) => {
                    let handle = setTimeout(() => {
                        eventHub.disconnect();
                        reject();
                    }, 30000);

                    eventHub.registerTxEvent(transactionId, (tx, code) => {
                        clearTimeout(handle);
                        eventHub.unregisterTxEvent(transactionId);
                        eventHub.disconnect();

                        if (code !== 'VALID') {
                            console.error(
                                'The transaction was invalid, code = ' + code);
                            reject();
                        } else {
                            console.log(
                                'The transaction has been committed on peer ' +
                                eventHub._ep._endpoint.addr);
                            resolve();
                        }
                    });
                });
                eventPromises.push(txPromise);
                const sendPromise = channel.sendTransaction(request);
                return Promise.all([sendPromise].concat(eventPromises))
                    .then((results) => {
                        console.log(' event promise all complete and testing complete');
                        return results[0]; // the first returned value is from the 'sendPromise' which is from the
                                           // 'sendTransaction()' call
                    })
                    .catch(err => {
                        console.error(
                            'Failed to send transaction and get notifications within the timeout period.'
                        );
                        return 'Failed to send transaction and get notifications within the timeout period.';
                    });
            } else {
                console.error(
                    'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...'
                );
                return 'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...';
            }
        })
        .then(response => {
            if (response.status === 'SUCCESS') {
                console.log('Successfully sent transaction to the orderer.');
                return txId.getTransactionID();
            } else {
                console.error('Failed to order the transaction. Error code: ' + response.status);
                return 'Failed to order the transaction. Error code: ' + response.status;
            }
        })
        .catch(err => {
            res.status(400).send(`Caught Error ${err}`);
        });

}

function _initialize(client) {
    const targets = [];
    let channel = {};

    console.log('Create a client and set the wallet location');

    return hfc.newDefaultKeyValueStore({ path: OPTIONS.walletPath })
        .then(wallet => {
            console.log(`Set wallet path and associate user ${OPTIONS.userId} with application`);
            client.setStateStore(wallet);
            return client.getUserContext(OPTIONS.userId, true);
        })
        .then(user => {
            console.log('Check that the user is enrolled and set a query URL in the network');
            if (user === undefined || !user.isEnrolled()) {
                console.error('User is not defined or not enrolled - error');
            }
            channel = client.newChannel(OPTIONS.channelId);
            const peer = client.newPeer(OPTIONS.peerUrl);
            const orderer = client.newOrderer(OPTIONS.ordererUrl);
            channel.addPeer(peer);
            channel.addOrderer(orderer);
            targets.push(peer);
            return channel;
        })
}