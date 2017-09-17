import { call, put, takeEvery, takeLatest, select, all } from 'redux-saga/effects';
import { combineSagas } from 'redux-saga';
import { selectors } from './TicketReducer';
import { actionCreators } from './TicketActionCreators';

/**
 * [ticketSaga description]
 * @return {Generator} [description]
 */
export default function* ticketSaga() {
	yield all([
		bootstrapSaga(),
		loginSaga(),
 ])
}

/**
 * [bootstrapSaga description]
 * @return {Generator} [description]
 */
function* bootstrapSaga() {
 return yield put(actionCreators.getTickets());
}

/**
 * Authentication saga, checks authentication.
 * @return {Generator} [description]
 */
function* loginSaga() {
	const auth = yield select(selectors.getAuth);
	console.log('Authentication Status: ', auth);
}
