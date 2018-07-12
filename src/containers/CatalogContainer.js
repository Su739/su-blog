import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import actions from '../actions';
import MaterialCatalog from '../components/MaterialCatalog';

class CatalogContainer extends React.Component {
  static propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    url: PropTypes.string,
    isEditor: PropTypes.bool,
    expanded: PropTypes.objectOf(PropTypes.bool),
    toggleExpandBtn: PropTypes.func.isRequired,
    screenWidth: PropTypes.number.isRequired,
    toggleCatalog: PropTypes.func.isRequired,
    toggleBlockedModal: PropTypes.func,
    addArticle: PropTypes.func,
    addBlockedArticle: PropTypes.func,
    onArticleDeleteClick: PropTypes.func,
    hasNewArticle: PropTypes.bool,
    isFetching: PropTypes.bool,
    // loadUser: PropTypes.func.isRequired,
    loadBook: PropTypes.func.isRequired,
    bookid: PropTypes.number,
    displayCatalog: PropTypes.bool.isRequired,
    bookArticles: PropTypes.arrayOf(PropTypes.object)
  };
  componentDidMount() {
    const {
      loadBook, bookid, isEditor
    } = this.props;
    // refreshAuthentication();
    // 这个暂时先注释掉，当通过url直接访问这页文章，可能appbar还没有请求user，这样会导致请求2次，所以先注释掉，交给appbar请求
    // loadUser(params.username);
    if (!isEditor) { // editor 页会loadBook, 并在第一次加载时强制刷新
      loadBook(bookid, true);
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.bookid !== this.props.bookid && Number.isInteger(this.props.bookid)) {
      this.props.loadBook(this.props.bookid);
    }
  }
  render() {
    const {
      bookArticles, isFetching, displayCatalog, screenWidth, history,
      expanded, url, isEditor, bookid,
      toggleCatalog, toggleExpandBtn, toggleBlockedModal,
      hasNewArticle, addArticle, addBlockedArticle, onArticleDeleteClick
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
        toggleBlockedModal={toggleBlockedModal}
        hasNewArticle={hasNewArticle}
        bookid={bookid}
        addBlockedArticle={addBlockedArticle}
        addArticle={addArticle}
        onArticleDeleteClick={onArticleDeleteClick}
        history={history}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { bookid } }, isEditor } = ownProps;

  const {
    entities: {
      books, articles
    },
    ui: {
      app: {
        catalog: { displayCatalog, isFetching, expanded },
        screenSize: { width: screenWidth }
      }
    },
    editingData: { articlesById, booksById, newArticle }
  } = state;

  if (isEditor) { // 正常来说，editorPage加载成功，这些数据是有的
    const book = booksById[bookid];
    const bookArticles = book.articles.map(a => articlesById[a]);
    return {
      book,
      bookArticles,
      displayCatalog,
      isFetching,
      screenWidth,
      bookid: parseInt(bookid, 10),
      hasNewArticle: !!newArticle
    };
  }

  // books[bookid].articles这句可以判断loadArticles是否执行
  const bookArticles = books[bookid] && books[bookid].articles
    ? books[bookid].articles.map(a => articles[a]) : [];
  return {
    book: books[bookid],
    bookArticles,
    displayCatalog,
    isFetching,
    screenWidth,
    expanded,
    hasTemp: true
  };
};

const {
  loadBook, toggleCatalog, refreshAuthentication, toggleExpandBtn, toggleBlockedModal,
  addArticle, addBlockedArticle, addDeletingArticles
} = actions;

export default withRouter(connect(
  mapStateToProps,
  {
    loadBook,
    toggleCatalog,
    refreshAuthentication,
    toggleExpandBtn,
    addArticle,
    addBlockedArticle,
    toggleBlockedModal,
    addDeletingArticles
  },
)(CatalogContainer));
