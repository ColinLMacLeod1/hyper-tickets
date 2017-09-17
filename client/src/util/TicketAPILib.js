/*
NOTE: This library is to interact with the hyper tickets API, and is built for the API
spec defined in the README at: https://github.com/zackharley/hyper-tickets
*/

import axios from 'axios';

/**
 * The endpoint to hit for the server information.
 * @type {String}
 */
const TICKET_API_ENDPOINT = 'https://hyper-tickets.appspot.com/api';

/**
 * Sends a request to the server to authenticate a user.
 * @param {String} username The username of the user.
 * @param {String} password The users password.
 * @return {Promise} The promise returned from the axios method invocation.
 */
const login = (username, password) => axios.post(`${TICKET_API_ENDPOINT}/login`, { username, password });

/**
 * Signs a user up for the application.
 * @param {String} username The username of the user.
 * @param {String} password The password of the user.
 * @param {String} displayName The display name of the user.
 */
const signup = (username, password, displayName) => axios.post(`${TICKET_API_ENDPOINT}/signup`, { username, password, displayName });

/**
 * Creates a ticket.
 * @param {String} owner The username of the owner of ticket.
 * @param {String} title The title of the ticket.
 * @param {String} location The location of the ticket.
 * @param {String} price The price of the ticket.
 * @param {String} type The type of ticket.
 * @param {String} seat The ticket seat.
 * @return {Promise} The promise returned from axios method invocation.
 */
const createTicket = ({ owner, title, location, price, type, seat }) => axios.post(`${TICKET_API_ENDPOINT}/create`, { owner, title, location, price, type, seat});

/**
 * Deletes a ticket.
 * @param {Integer} id The id of the ticket to be deleted.
 * @return {Promise} The promise returned from axios method invocation.
 */
const deleteTicket = id => axios.post(`${TICKET_API_ENDPOINT}/delete`, { id });

/**
 * Edits a ticket.
 * @param {[type]} id [description]
 * @return {[type]}    [description]
 */
const editTicket = id => axios.post(`${TICKET_API_ENDPOINT}/edit`);

/**
 * Buys a ticket.
 * @param {String} purcahser The username of the ticket purchaser.
 * @param {Integer} id The id of the ticket being purchased.
 * @return {Promise} The promise returned from axios method invocation.
 */
const buyTicket = (purcahser, id) => axios.post(`${TICKET_API_ENDPOINT}/buy`, { owner, id });

/**
 * Gets the user object from the server.
 * @param {String} username The username of the user.
 * @return {Promise} The promise returned from axios method invocation.
 */
const getUser = username => axios.get(`${TICKET_API_ENDPOINT}/user/${username}`);

/**
 * Gets all of the tickets on the server.
 * @return {Promise} The promise returned from axios method invocation.
 */
const getTickets = () => axios.get(`${TICKET_API_ENDPOINT}/ticketlist`);

/**
 * Gets a ticket by its identifier from the server.
 * @param {Integer} id The identifier of the ticket to be fetched.
 * @return {Promise} The promise returned from axios method invocation.
 */
const getTicketById = id => axios.get(`${TICKET_API_ENDPOINT}/ticket/${id}`);

/**
 * The library utility methods represented as a object.
 * @type {Object}
 */
const ticketLib = {
	login,
	signup,
	createTicket,
	deleteTicket,
	buyTicket,
	getUser,
	getTickets,
	getTicketById,
}

/**
 * Export the library for use.
 */
export default ticketLib;
