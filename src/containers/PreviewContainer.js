import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import actions from '../actions';
import Preview from '../components/Preview';

const { loadArticle } = actions;

class PreviewContainer extends React.Component {
  static propTypes = {
    book: PropTypes.objectOf(PropTypes.any),
    articleid: PropTypes.number,
    article: PropTypes.objectOf(PropTypes.any),
    isFetching: PropTypes.bool,
    loadArticle: PropTypes.func
  };
  componentDidMount() {
    const {
      articleid, article
    } = this.props;
    if ((!article || !article.content) && articleid) {
      this.props.loadArticle(articleid);
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.articleid !== this.props.articleid) {
      this.props.loadArticle(this.props.articleid);
    }
  }
  render() {
    const { isFetching, article, book } = this.props;
    return (
      <Preview isFetching={isFetching} article={article || book.description} />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { articleid, bookid } = ownProps.match.params;
  const {
    entities: {
      articles, books
    },
    result,
    ui: { preview: { isFetching } }
  } = state;

  const book = books[bookid];
  let readmeid = null;
  if (!articleid) {
    if (!book) {
      throw new Error('book最少有一篇depth为-1的readme');
    }
    ([readmeid] = book.articles.filter(a => articles[a].superior === -1));
  }
  const article = articles[articleid || readmeid];

  return {
    book,
    articleid: parseInt(articleid, 10) || parseInt(readmeid, 10),
    article,
    isFetching,
    result
  };
};

export default withRouter(connect(mapStateToProps, { loadArticle })(PreviewContainer));
