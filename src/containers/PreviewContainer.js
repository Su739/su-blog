import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import actions from '../actions';
import Preview from '../components/Preview';
import Error404 from '../components/Error404';

const { loadArticle } = actions;

class PreviewContainer extends React.Component {
  static propTypes = {
    loginName: PropTypes.string,
    username: PropTypes.string,
    articleid: PropTypes.number,
    bookid: PropTypes.number,
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
    const {
      isFetching, article, articleid, bookid, error, loginName, username
    } = this.props;
    if (error) {
      return <Error404 />;
    }
    return (
      <div>
        {loginName === username && <div className="btn-edit"><Link to={`/${username}/book/${bookid}/~/edit/${articleid}`}>编辑文章</Link></div>}
        {article && <Preview loginName={loginName} isFetching={isFetching} article={article || { content: ' ' }} />}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { articleid, bookid, username } = ownProps.match.params;
  const {
    auth: { loginName },
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
    loginName,
    username,
    articleid: parseInt(articleid, 10) || parseInt(readmeid, 10),
    bookid: parseInt(bookid, 10),
    article,
    isFetching,
    error,
    result
  };
};

export default withRouter(connect(mapStateToProps, { loadArticle })(PreviewContainer));
