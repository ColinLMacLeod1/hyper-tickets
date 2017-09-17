import ticketLib from '../util/TicketAPILib';
import utils from '../util/utils';

/*
NOTE: Should come back and fix the error handling when things cannot be retrieved successfully.
Also, all of the thunk action creators could be replaced with sagas, this would be nicer.
*/

/**
 * The different actions for the ticket application.
 * NOTE: Namespaced to increase future compatibility with other state machines.
 * @type {Object}
 */
export const actions = {
	LOGGED_IN: '@@ticket/LOGGED_IN',
	LOGGED_OUT: '@@ticket/LOGGED_OUT',

	CREATE_TICKET: '@@ticket/CREATE_TICKET',
	UPDATE_TICKET: '@@ticket/UPDATE_TICKET',
	DELETE_TICKET: '@@ticket/DELETE_TICKET',

	BUY_TICKET: '@@ticket/BUY_TICKET',
	SELL_TICKET: '@@ticket/SELL_TICKET',

  GET_TICKETS: '@@ticket/GET_TICKETS',
	GET_TICKET: '@@ticket/GET_TICKET'
}

/**
 * Redux thunk action creator to retrieve the tickets from server.
 * @return {Function} Dispatched action once the tickets are retrieved.
 */
const getTickets = () => dispatch => {
	ticketLib.getTickets().then(response => {
		utils.logInfo('Tickets retrieved:', response);
		const tickets = response.data;
		return dispatch({ type: actions.GET_TICKETS, data: tickets });
	}).catch(error => {
		return utils.logError('There was an error retreiving tickets from the server!', error);
	});
}

/**
 * Redux thunk action creator to retrieve a ticket by its identifier from server.
 * @param {Integer} identifier The identifier of the ticket.
 * @return {Function} Dispatched action once the ticket is retreived.
 */
const getTicketById = identifier => dispatch => {
	ticketLib.getTicketById(identifier).then(response => {
		util.logInfo('Ticket retrieved by id:', response);
		return dispatch({ type: actions.GET_TICKET, data: ticket });
	}).catch(error => {
		return util.logError('There was an error retrieving a ticket by the identifier!', error);
	});
}

/**
 * Logs a user into the application.
 * @param {String} password The password of the user.
 * @param {String} username The username of the user.
 */
const login = ({ password, username }) => dispatch => {
	ticketLib.login(username, password).then(response => {
		utils.logInfo('Response about authentication recevied:', response);
		//if (response.data === false) return dispatch({ type: actions.LOGGED_OUT });
		const user = response.data;
		console.log('USER', user);
		return dispatch({ type: actions.LOGGED_IN, data: user });
	}).catch(error => {
		return util.logError('There was an error authenticating the user!', error);
	});
}

const signup = ({ username, displayName, password }) => dispatch => {
	ticketLib.signup(username, password, displayName).then(response => {
		utils.logInfo('Response about signup recevied:', response);
		if (response.data === false) return dispatch({ type: actions.LOGGED_OUT });
		return dispatch({ type: actions.LOGGED_IN });
	}).catch(error => {
		return util.logError('There was an error authenticating the user!', error);
	});
}

/**
 * All action creators that are implemeted with redux thunks.
 * @type {Object}
 */
const thunkActionCreators = {
	getTickets,
	getTicketById,
	login,
	signup
}

/**
 * Action creators for the redux state machine.
 * @type {Object}
 */
export const actionCreators = {
	...thunkActionCreators,
  logout: () => ({ type: actions.LOGGED_OUT }),
}
