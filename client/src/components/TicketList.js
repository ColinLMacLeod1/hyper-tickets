import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Provider from 'react-redux';

import { selectors as ticketSelectors } from '../state/TicketReducer';

class TicketList extends Component {

	/**
	 * Renders the list of tickets.
	 * @return {Array} Array of ticket list item elements.
	 */
	renderTicketList = () => (
		Object.values(this.props.tickets).map((ticket,i) => {
			return (
				<div key={i}>
					<p>{ticket.title}</p>
				</div>
			)
		})
	);

	/**
	 * Renders the entire component.
	 */
	render = () => {
		return (
			<div id="container">
				{this.renderTicketList()}
			</div>
		);
	}
}

/**
 * Maps the state tree attributes to component level properties.
 * @param {Object} state The redux state object.
 * @param {Object} ownProps The components own properties.
 * @return {Object} The comonents new properties for use.
 */
const mapStateToProps = (state, ownProps) => {
	return {
		...ownProps,
		tickets: ticketSelectors.getTickets(state)
	}
}

export default connect(mapStateToProps)(TicketList);
