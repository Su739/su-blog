import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import PreviewContainer from '../PreviewContainer';
import CatalogContainer from '../CatalogContainer';
import Error404 from '../../components/Error404';
import './ArticlePage.css';

const ArticlePage = (props) => {
  console.log(props);
  const { match, error } = props;
  if (error) {
    return <Error404 />;
  }
  return (
    <div>
      <CatalogContainer
        url={(match.url).replace(/\/$/, '')}// 有时候会出现输入url结尾带'/'的情况
        isEditor={false}
        bookid={parseInt(match.params.bookid, 10)}
      />
      <div className="article-pane">
        <Switch>
          <Route path="/:username/book/:bookid/a/:articleid" component={PreviewContainer} />
          <Route exact path="/:username/book/:bookid" component={PreviewContainer} />
          <Route path="/" component={Error404} />
        </Switch>
      </div>
    </div>
  );
};

ArticlePage.propTypes = {
  match: PropTypes.shape({
    isExact: PropTypes.bool,
    params: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }),
  error: PropTypes.objectOf(PropTypes.any)
};

/* <div className="article-pane">
          <Route path="/:username/book/:bookid/a/:articleid" component={Preview} />
          <Route path="/:username/book/:bookid" component={Preview} />
        </div> */
const mapStateToProps = state => ({ error: state.requestError });

export default withRouter(connect(mapStateToProps)(ArticlePage));
