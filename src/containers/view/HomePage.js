import React from 'react';
// import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import NavBar from '../NavBar';
import LoginForm from '../form/LoginForm';
import Error404 from '../../components/Error404';
import ArticlePage from './ArticlePage';
import EditorPage from './EditorPage';

const HomePage = props => (
  <div>
    <NavBar {...props} />
    <LoginForm />
    <Switch>
      <Route exact path="/" render={() => <div>Home</div>} />
      <Route
        path="/:username"
        render={
          ({ match }) => (
            <div className="content">
              <Switch>
                <Route exact path={match.url} render={() => <div>等一个UserPage</div>} />
                <Route path="/:username/book/:bookid/~/edit" component={EditorPage} />
                <Route path="/:username/book/:bookid" component={ArticlePage} />
                <Route path="/" component={Error404} />
              </Switch>
            </div>
          )
        }
      />
      <Route path="/" component={Error404} />
    </Switch>
  </div>
);

export default HomePage;
