import React, { Component } from 'react';
import connect from 'react-redux';

class TicketDetail extends Component {

	render = () => {
		return (
			<div>
				help
			</div>
		)
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		...ownProps
	}
}

export default connect(mapStateToProps)(TicketDetail);
