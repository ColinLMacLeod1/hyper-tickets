require('../stylesheets/main.scss');

import { selectors as ticketSelectors } from '../state/ticketReducer';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import TicketList from './TicketList';
import { Link } from './react-router-dom';
import Login from './Login';

class App extends Component {

	/**
	 * Renders the login form if the user is not authenticated.
	 */
	renderLogin = () => (
		<Login visible={!this.props.isAuthenticated} />
	);

	/**
	 * Renders the list of tickets.
	 */
	renderTicketList = () => (
		<TicketList />
	);

	/**
	 * Renders the application.
	 */
	render = () => {
		console.log('login', this.props);
		return (
			<div id="container">
				{this.renderTicketList()}
			</div>
		)
	}
}

/**
 * Maps redux state tree to the component level properties.
 * @param {Object} state The redux state tree.
 * @param {Object} ownProps The component level properties.
 * @return {Object} The new component properties.
 */
const mapStateToProps = (state, ownProps) => {
	return {
		...ownProps,
		isAuthenticated: ticketSelectors.getAuth(state)
	}
}

export default connect(mapStateToProps)(App);
