import { createStore, applyMiddleware, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';

import { ticketReducerMount, ticketReducer } from './TicketReducer';
import ticketSaga from './TicketSaga';

/**
 * Creates the saga middleware.
 */
const sagaMiddleware = createSagaMiddleware();

/**
 * The redux reducers, normalized on a mount for better component state separation.
 */
const reducers = combineReducers({
  [ticketReducerMount]: ticketReducer,
	form: formReducer
});

/**
 * Creates the redux store for the application.
 */
export const ticketStore = createStore(
  reducers,
  applyMiddleware(thunk, sagaMiddleware)
);

/**
 * Run the sagas.
 */
sagaMiddleware.run(ticketSaga);
