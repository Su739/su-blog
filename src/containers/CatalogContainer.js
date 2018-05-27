import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from '../actions';
import MaterialCatalog from '../components/MaterialCatalog';

class CatalogContainer extends React.Component {
  static propTypes = {
    isEditor: PropTypes.bool,
    expanded: PropTypes.objectOf(PropTypes.bool),
    toggleExpandBtn: PropTypes.func.isRequired,
    screenWidth: PropTypes.number.isRequired,
    refreshAuthentication: PropTypes.func.isRequired,
    toggleCatalog: PropTypes.func.isRequired,
    isFetching: PropTypes.bool,
    url: PropTypes.string,
    // loadUser: PropTypes.func.isRequired,
    loadBook: PropTypes.func.isRequired,
    bookid: PropTypes.number,
    displayCatalog: PropTypes.bool.isRequired,
    bookArticles: PropTypes.arrayOf(PropTypes.object)
  };
  componentDidMount() {
    const {
      loadBook, bookid
    } = this.props;
    console.log(this.props);
    // refreshAuthentication();
    // 这个暂时先注释掉，当通过url直接访问这页文章，可能appbar还没有请求user，这样会导致请求2次，所以先注释掉，交给appbar请求
    // loadUser(params.username);
    loadBook(bookid);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.bookid !== this.props.bookid) {
      this.props.loadBook(this.props.bookid);
    }
  }
  render() {
    const {
      bookArticles, isFetching, displayCatalog, screenWidth, expanded, url, isEditor,
      toggleCatalog, toggleExpandBtn
    } = this.props;
    return (
      <MaterialCatalog
        isFetching={isFetching}
        displayCatalog={displayCatalog}
        handleToggleCatalog={toggleCatalog}
        articles={bookArticles}
        screenWidth={screenWidth}
        toggleExpandBtn={toggleExpandBtn}
        expanded={expanded}// 目录中被折叠的项目
        url={url}
        isEditor={isEditor}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { bookid } = ownProps;
  const {
    entities: {
      books, articles
    },
    result,
    ui: { catalog: { displayCatalog, isFetching, expanded }, screen: screenWidth }
  } = state;

  const aKeys = Object.keys(articles);
  const allArticles = aKeys && aKeys.length > 0 ? aKeys.map(key => articles[key]) : [];
  // books[bookid].articles这句可以判断loadArticles是否执行
  const bookArticles = allArticles.length > 0 && books[bookid] && books[bookid].articles
    ? allArticles.filter(a => a.parent === Number(bookid)) : [];
  console.log(books[bookid]);
  console.log(bookArticles);
  return {
    book: books[bookid],
    bookArticles,
    displayCatalog,
    isFetching,
    screenWidth,
    expanded,
    result
  };
};

const {
  loadBook, toggleCatalog, refreshAuthentication, toggleExpandBtn
} = actions;

export default connect(
  mapStateToProps,
  {
    loadBook, toggleCatalog, refreshAuthentication, toggleExpandBtn
  },
)(CatalogContainer);
