import { BrowserRouter, Route, Link } from 'react-router-dom';
import { ticketStore } from './state/TicketStore';
import { Provider } from 'react-redux';
import TicketList from './components/TicketList';
import App from './components/App';
import ReactDOM from 'react-dom';
import React from 'react';

/**
 * Renders the application, redux store is the top level component.
 * @return {Function} Reference to the component on the DOM, or null for stateless components.
 */
const renderApplication = () => {
	ReactDOM.render(
		<Provider store={ticketStore}>
			<BrowserRouter>
				<div>
					<Route exact path="/" component={App} />
					<Route exact path="/ticketlists" component={TicketList} />
				</div>
			</BrowserRouter>
		</Provider>
		,document.getElementById('root')
	);
}

// render the application
renderApplication();

// for hot reloading, webpack development server
if (module.hot) {
	module.hot.accept('./components/App', () => {
		const NextRootContainer = require('./components/App').default;
		renderApplication();
	});
}
