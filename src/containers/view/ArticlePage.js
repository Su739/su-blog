import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import actions from '../../actions';
import PreviewContainer from '../PreviewContainer';
import CatalogContainer from '../CatalogContainer';
import Error404 from '../../components/Error404';
import './ArticlePage.css';

class ArticlePage extends React.Component {
  componentDidMount() {
    if (process.env.NODE_ENV === 'production') {
      this.props.refreshAuthentication();
    }
  }
  render() {
    const { match, error, location } = this.props;
    if (error) {
      return <Error404 />;
    }
    return (
      <div className="article-page-container">
        <CatalogContainer
          url={(match.url).replace(/\/$/, '')}// 有时候会出现输入url结尾带'/'的情况
          isEditor={false}
          bookid={parseInt(match.params.bookid, 10)}
          location={location}
        />
        <div className="article-pane">
          <Switch>
            <Route path="/:username/book/:bookid/a/:articleid*" component={PreviewContainer} />
            <Route path="/" component={Error404} />
          </Switch>
        </div>
      </div>
    );
  }
}

ArticlePage.propTypes = {
  match: PropTypes.shape({
    isExact: PropTypes.bool,
    params: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }),
  location: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  refreshAuthentication: PropTypes.func
};

const mapStateToProps = state => ({ error: state.requestError });

const { refreshAuthentication } = actions;

export default withRouter(connect(mapStateToProps, { refreshAuthentication })(ArticlePage));
