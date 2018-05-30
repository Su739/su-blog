import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from '../actions';
import MaterialCatalog from '../components/MaterialCatalog';

class CatalogContainer extends React.Component {
  static propTypes = {
    hasTemp: PropTypes.bool,
    isEditor: PropTypes.bool,
    expanded: PropTypes.objectOf(PropTypes.bool),
    toggleExpandBtn: PropTypes.func.isRequired,
    screenWidth: PropTypes.number.isRequired,
    refreshAuthentication: PropTypes.func.isRequired,
    toggleCatalog: PropTypes.func.isRequired,
    toggleBlockedModal: PropTypes.func,
    addNewArticle: PropTypes.func,
    destroyNewArticle: PropTypes.func,
    addBlockedArticle: PropTypes.func,
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
    console.log(this.props.bookid);
    if (prevProps.bookid !== this.props.bookid && Number.isInteger(this.props.bookid)) {
      this.props.loadBook(this.props.bookid);
    }
  }
  render() {
    const {
      bookArticles, isFetching, displayCatalog, screenWidth,
      expanded, url, isEditor, hasTemp,
      toggleCatalog, toggleExpandBtn, toggleBlockedModal,
      destroyNewArticle, addBlockedArticle, addNewArticle
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
        toolMethods={{ addNewArticle, destroyNewArticle }}
        toggleBlockedModal={toggleBlockedModal}
        hasTemp={hasTemp}
        addBlockedArticle={addBlockedArticle}
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
    tempData: { newArticle },
    result,
    ui: {
      catalog: { displayCatalog, isFetching, expanded },
      screen: screenWidth
    }
  } = state;

  const aKeys = Object.keys(articles);
  const allArticles = aKeys && aKeys.length > 0 ? aKeys.map(key => articles[key]) : [];
  // books[bookid].articles这句可以判断loadArticles是否执行
  const bookArticles = allArticles.length > 0 && books[bookid] && books[bookid].articles
    ? allArticles.filter(a => a.parent === Number(bookid)) : [];
  if (newArticle) {
    bookArticles.push(newArticle);
  }
  console.log(books[bookid]);
  console.log(bookArticles);
  return {
    book: books[bookid],
    bookArticles,
    displayCatalog,
    isFetching,
    screenWidth,
    expanded,
    hasTemp: !!newArticle,
    result
  };
};

const {
  loadBook, toggleCatalog, refreshAuthentication, toggleExpandBtn, toggleBlockedModal,
  addNewArticle, destroyNewArticle, addBlockedArticle
} = actions;

export default connect(
  mapStateToProps,
  {
    loadBook,
    toggleCatalog,
    refreshAuthentication,
    toggleExpandBtn,
    addNewArticle,
    destroyNewArticle,
    addBlockedArticle,
    toggleBlockedModal
  },
)(CatalogContainer);
