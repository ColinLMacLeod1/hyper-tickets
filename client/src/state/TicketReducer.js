import { actions } from './TicketActionCreators';

/**
 * Reducer mount for the ticket reducer.
 * @type {String}
 */
export const ticketReducerMount = 'ticketReducer';

/**
 * The intial state of the application.
 * @type {Object}
 */
const initialState = {
	tickets: {},
	auth: false,
	user: {}
};

/**
 * Selectors for elements on the state tree.
 * @type {Object}
 */
export const selectors = {
	getTickets: state => state[ticketReducerMount].tickets,
	getAuth: state => state[ticketReducerMount].auth,
	getUser: state => state[ticketReducerMount].user
}

/**
 * The action handlers.
 * @type {Object}
 */
const handlers = {
	[actions.GET_TICKETS]: (state, action) => {
		let tickets = action.data;
		let newTickets;
		tickets.forEach(ticket => {
			newTickets = {
				...newTickets,
				[ticket.id]: ticket
			}
		});
		return {
			...state,
			tickets
		}
	},
	[actions.GET_TICKET]: (state, action) => {
		let ticket = action.data;
		return {
			...state,
			tickets: {
				[ticket.id]: ticket,
				...state.tickets
			}
		}
	},
	[actions.LOGGED_IN]: (state, action) => {
		let user = action.data;
		return {
			 ...state,
			 auth: true,
		 }
	},
	[actions.LOGGED_OUT]: (state, action) => {
		debugger;
		return {
			...state,
			auth: false,
			user: {}
		}
 },
}

/**
 * The ticket reducer, main reducer for the application.
 * @param {Object} [state=initialState] The state object, defaults to initial state.
 * @param {Object} action Action that has been dispatched to the reducer.
 * @return {Object} The new state object after reducing.
 */
export const ticketReducer = (state = initialState, action) => {
	if (handlers[action.type]) return handlers[action.type](state, action);
	return initialState;
}
