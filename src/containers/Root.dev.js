import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'; // v1.x
import { MuiThemeProvider as V0MuiThemeProvider } from 'material-ui';
import DevTools from './DevTools';
// import UserPage from './UserPage';
import HomePage from './view/HomePage';


const Root = ({ store }) => (
  <Provider store={store}>
    <div>
      <Router>
        <MuiThemeProvider theme={createMuiTheme()}>
          <V0MuiThemeProvider muiTheme={getMuiTheme()}>
            <div>
              <Route Path="/" component={HomePage} />
            </div>
          </V0MuiThemeProvider>
        </MuiThemeProvider>
      </Router>
      <DevTools />
    </div>
  </Provider>
);
/* <Route Path="/:username/book/:bookid" component={ArticlePage} />
              <Route Path="/:username" component={UserPage} /> */
Root.propTypes = {
  store: PropTypes.objectOf(PropTypes.any)
};

export default Root;
