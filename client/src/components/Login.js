import { selectors as ticketSelectors } from '../state/TicketReducer';
import { actionCreators } from '../state/TicketActionCreators';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoginForm from './LoginForm';

let { login } = actionCreators;

class Login extends Component {

	/**
	 * Handles the submit action for the login form.
	 * @param {Object} values The values entered into the login form.
	 */
	handleLoginFormSubmit = (values) => {
		let { username, password } = values;
		this.props.login({ username, password });
	}

	/**
	 * Renders the login modal.
	 */
	render() {
		return (
			<LoginForm onSubmit={this.handleLoginFormSubmit} />
		)
	}
}

/**
 * Maps the state tree to the component level properties.
 * @param {Object} state The state tree, from redux.
 * @param {Object} ownProps The components properties.
 * @return {Object} The new component level properties.
 */
const mapStateToProps = (state, ownProps) => {
	return {
		...ownProps,
		auth: ticketSelectors.getAuth(state)
	}
}

export default connect(mapStateToProps, { login })(Login);
