import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import actions from '../actions';
import PreviewContainer from './PreviewContainer';
import MaterialCatalog from '../components/MaterialCatalog';
import Error404 from '../components/Error404';

class ArticlePage extends React.Component {
  static propTypes = {
    expanded: PropTypes.objectOf(PropTypes.bool),
    toggleExpandBtn: PropTypes.func.isRequired,
    screenWidth: PropTypes.number.isRequired,
    refreshAuthentication: PropTypes.func.isRequired,
    toggleCatalog: PropTypes.func.isRequired,
    isFetching: PropTypes.bool,
    // loadUser: PropTypes.func.isRequired,
    loadBook: PropTypes.func.isRequired,
    match: PropTypes.shape({
      isExact: PropTypes.bool,
      params: PropTypes.object.isRequired,
      path: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    }),
    displayCatalog: PropTypes.bool.isRequired,
    bookArticles: PropTypes.arrayOf(PropTypes.object),
    error: PropTypes.objectOf(PropTypes.any)
  };
  componentDidMount() {
    const {
      loadBook, match: { params }// , refreshAuthentication // , loadUser
    } = this.props;
    // refreshAuthentication();
    // 这个暂时先注释掉，当通过url直接访问这页文章，可能appbar还没有请求user，这样会导致请求2次，所以先注释掉，交给appbar请求
    // loadUser(params.username);
    loadBook(params.bookid);
  }
  render() {
    const {
      bookArticles, isFetching, match, displayCatalog, screenWidth, expanded, error,
      toggleCatalog, toggleExpandBtn
    } = this.props;
    if (error) {
      return <Error404 />;
    }
    return (
      <div>
        <MaterialCatalog
          isFetching={isFetching}
          displayCatalog={displayCatalog}
          handleToggleCatalog={toggleCatalog}
          articles={bookArticles}
          screenWidth={screenWidth}
          toggleExpandBtn={toggleExpandBtn}
          expanded={expanded}// 目录中被折叠的项目
          url={match.url}
          isEditor={false}
        />
        {(bookArticles && bookArticles.length > 0) &&
        // 讲道理container中不要写css的，但是因为程序简单，所以没有page独自的componen，直接把布局写在里面
        <div className="article-pane">
          <Switch>
            <Route path="/:username/book/:bookid/a/:articleid" component={PreviewContainer} />
            <Route exact path="/:username/book/:bookid" component={PreviewContainer} />
            <Route path="/" component={Error404} />
          </Switch>
        </div>}
      </div>
    );
  }
}

/* <div className="article-pane">
          <Route path="/:username/book/:bookid/a/:articleid" component={Preview} />
          <Route path="/:username/book/:bookid" component={Preview} />
        </div> */
const mapStateToProps = (state, ownProps) => {
  const { bookid } = ownProps.match.params;
  const {
    entities: {
      books, articles
    },
    result,
    requestError,
    ui: { catalog: { displayCatalog, isFetching, expanded }, screen: screenWidth }
  } = state;

  const aKeys = Object.keys(articles);
  const allArticles = aKeys && aKeys.length > 0 ? aKeys.map(key => articles[key]) : [];
  const bookArticles = allArticles.length > 0
    ? allArticles.filter(a => a.parent === Number(bookid)) : [];
  const error = requestError;
  return {
    book: books[bookid],
    bookArticles,
    displayCatalog,
    isFetching,
    screenWidth,
    expanded,
    error,
    result
  };
};

const {
  loadUser, loadBook, toggleCatalog, refreshAuthentication, toggleExpandBtn
} = actions;

export default withRouter(connect(
  mapStateToProps,
  {
    loadUser, loadBook, toggleCatalog, refreshAuthentication, toggleExpandBtn
  },
)(ArticlePage));
