import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'; // v1.x
import V0MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Loadable from 'react-loadable';
import DevTools from './DevTools';
import NavBar from './NavBar';
import LoginForm from './form/LoginForm';
import Error404 from '../components/Error404';
import UserPage from './view/UserPage';
import HomePage from './view/HomePage';
import EditorLoadingPage from '../components/EditorLoadingPage';

const EditorPage = Loadable({
  loader: () => import('./view/EditorPage'),
  loading: EditorLoadingPage
});

const ArticlePage = Loadable({
  loader: () => import('./view/ArticlePage'),
  loading: EditorLoadingPage
});

const Root = ({ store }, ...props) => (
  <Provider store={store}>
    <div>
      <Router>
        <MuiThemeProvider theme={createMuiTheme()}>
          <V0MuiThemeProvider muiTheme={getMuiTheme()}>
            <div>
              <LoginForm />
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route
                  path="/:username"
                  render={
                    ({ match }) => (
                      <div>
                        <NavBar ownerName={match.params.username} />
                        <div className="content">
                          <Switch>
                            <Route exact path="/:username" component={UserPage} />
                            <Route exact path="/:username/book/:bookid/~/edit" component={EditorPage} />
                            <Route path="/:username/book/:bookid/~/edit/:articleid" component={EditorPage} />
                            <Route path="/:username/book/:bookid" component={ArticlePage} />
                            <Route path="/" component={Error404} />
                          </Switch>
                        </div>
                      </div>
                    )
                  }
                />
                <Route path="/" component={Error404} />
              </Switch>
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
