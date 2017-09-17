import { BrowserRouter, Route, Link } from 'react-router-dom';
import { ticketStore } from './state/TicketStore';
import { Provider } from 'react-redux';
import TicketList from './components/TicketList';
import App from './components/App';
import ReactDOM from 'react-dom';
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#6699ff',
		accent1Color: '#ffcc33'
  }
});

/**
 * Renders the application, redux store is the top level component.
 * @return {Function} Reference to the component on the DOM, or null for stateless components.
 */
const renderApplication = () => {
	ReactDOM.render(
		<MuiThemeProvider muiTheme={muiTheme}>
			<Provider store={ticketStore}>
				<BrowserRouter>
						<Route path="/" component={App} />
				</BrowserRouter>
			</Provider>
		</MuiThemeProvider>
		,document.getElementById('root')
	);
}

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
// render the application
renderApplication();

// for hot reloading, webpack development server
if (module.hot) {
	module.hot.accept('./components/App', () => {
		const NextRootContainer = require('./components/App').default;
		renderApplication();
	});
}
