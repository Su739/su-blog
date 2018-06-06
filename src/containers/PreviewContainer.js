import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import actions from '../actions';
import Preview from '../components/Preview';
import Error404 from '../components/Error404';

const { loadArticle } = actions;

class PreviewContainer extends React.Component {
  static propTypes = {
    articleid: PropTypes.number,
    article: PropTypes.objectOf(PropTypes.any),
    isFetching: PropTypes.bool,
    loadArticle: PropTypes.func,
    error: PropTypes.objectOf(PropTypes.any)
  };
  componentDidMount() {
    const {
      articleid, article
    } = this.props;
    console.log(this.props);
    if ((!article || !article.content) && !Number.isNaN(articleid)) {
      this.props.loadArticle(articleid);
    }
  }
  componentDidUpdate(prevProps) {
    if (!Number.isNaN(this.props.articleid) && prevProps.articleid !== this.props.articleid) {
      this.props.loadArticle(this.props.articleid);
    }
  }
  render() {
    const { isFetching, article, error } = this.props;
    if (error) {
      return <Error404 />;
    }
    return (
      { article } && <Preview isFetching={isFetching} article={article || { content: '' }} />
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
    requestError: error,
    ui: { preview: { isFetching } }
  } = state;

  let readmeid = null;
  if (!articleid) {
    // books[bookid].articles这句可以判断loadBook是否执行完成, 总感觉要想想其他办法，不这么干
    if (books && books[bookid] && books[bookid].articles) {
      ([readmeid] = books[bookid].articles.filter(a => articles[a].superior === -1));
      // throw new Error('book最少有一篇depth为-1的readme');
    }
  }
  const article = articles ? articles[articleid || readmeid] : null;

  return {
    articleid: parseInt(articleid, 10) || parseInt(readmeid, 10),
    article,
    isFetching,
    error,
    result
  };
};

export default withRouter(connect(mapStateToProps, { loadArticle })(PreviewContainer));
