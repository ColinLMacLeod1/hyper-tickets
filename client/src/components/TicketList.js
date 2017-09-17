import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Provider from 'react-redux';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';


import { selectors as ticketSelectors } from '../state/TicketReducer';

class TicketList extends Component {

	/**
	 * Renders the list of tickets.
	 * @return {Array} Array of ticket list item elements.
	 */
	renderTicketList = () => (
		Object.values(this.props.tickets).map((ticket,i) => {
			return (
				<div key={i} className="ticket">
					<Card>
						<CardHeader
							title={ticket.ownerId}
							subtitle={ticket.location}
						/>
						<CardTitle
							title={ticket.title}
							subtitle={ticket.type+' for $'+ticket.price.toString()+' in seat '+ticket.seat}
						/>
					</Card>
				</div>
			)
		})
	);

	/**
	 * Renders the entire component.
	 */
	render = () => {
		return (
			<div className="listContainer">
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
