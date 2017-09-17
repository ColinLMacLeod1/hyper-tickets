require('../stylesheets/main.scss');

import { selectors as ticketSelectors } from '../state/ticketReducer';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import TicketList from './TicketList';
import Search from './Search'
import Login from './Login';
import Coinbase from './Coinbase';
import {Tabs, Tab} from 'material-ui/Tabs'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

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

		return (
			<div id="container">
				<center className="header"><h1 className="headerTitle">Hyper Tickets</h1></center>
				<Tabs>
					<Tab label="Discover">
						{this.renderTicketList()}
					</Tab>
					<Tab label="Search">
						<Search />
					</Tab>
				</Tabs>
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
