import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DevTools from './DevTools';
// import UserPage from './UserPage';
import NavBar from './NavBar';
import ArticlePage from './ArticlePage';
import LoginForm from './LoginForm';
import Error404 from '../components/Error404';


const Root = ({ store }) => (
  <Provider store={store}>
    <div>
      <Router>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <div>
            <Route Path="/" component={NavBar} />
            <Route Path="/" component={LoginForm} />
            <Switch>
              <Route exact path="/" render={() => <div>Home</div>} />
              <Route
                path="/:username"
                render={
                  ({ match }) => (
                    <div className="content">
                      <Switch>
                        <Route exact path={match.url} render={() => <div>等一个UserPage</div>} />
                        <Route
                          path="/:username/book/:bookid"
                          component={ArticlePage}
                        />
                        <Route path="/" component={Error404} />
                      </Switch>
                    </div>
                  )
                }
              />
              <Route path="/" component={Error404} />
            </Switch>
          </div>
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
