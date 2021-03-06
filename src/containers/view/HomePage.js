import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Cached from 'material-ui/svg-icons/action/cached';
import actions from '../../actions';
import ArticleListItem from '../../components/ArticleListItem';
import NavBar from '../NavBar';
import './HomePage.css';

class HomePage extends React.Component {
  static propTypes = {
    articleList: PropTypes.objectOf(PropTypes.any),
    articles: PropTypes.objectOf(PropTypes.object),
    loadArticleList: PropTypes.func,
    updateLatestScroll: PropTypes.func,
    refreshAuthentication: PropTypes.func,
    screenHeight: PropTypes.number,
    curScroll: PropTypes.number
  }
  constructor(props) {
    super(props);
    /* eslint-disable no-undef */
    this.state = {
      isMobile: typeof navigator === 'undefined' ||
      (navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i))
    };
    /* eslint-enable */
  }
  componentDidMount() {
    if (process.env.NODE_ENV === 'production') {
      this.props.refreshAuthentication();
    }
    this.handleScroll = this.handleScroll.bind(this);
    this.loader = React.createRef();// 加载提示component
    // 每次加载HomePage，都要强制刷新articleList，列表加载成功后判断是否还有下一页，如果有增加scroll监听
    this.props.loadArticleList(true).then((result) => {
      if (result.response.nextPageUrl) {
        window.addEventListener('scroll', this.handleScroll);// eslint-disable-line no-undef
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);// eslint-disable-line no-undef
  }

  componentDidUpdate() {
    // 如果没有nextpage，不会渲染loader
    if (this.loader.current) {
      const loaderOffsetTop = this.loader.current.offsetTop;// loader的当前位置
      const {
        curScroll, screenHeight, loadArticleList, articleList
      } = this.props;
      if ((screenHeight + curScroll) - loaderOffsetTop > 10) { // 滚动到loader附近
        if (articleList.nextPageUrl && !articleList.isFetching) { // 避免fetching时重复加载
          loadArticleList();
        }
      }
    } else {
      window.removeEventListener('scroll', this.handleScroll);// eslint-disable-line no-undef
    }
  }

  handleScroll() {
    /* eslint-disable no-undef */
    if (this.state.isMobile) {
      this.props.updateLatestScroll(document.body.scrollTop);
    } else {
      this.props.updateLatestScroll(document.documentElement.scrollTop);
    }
    /* eslint-enable */
  }

  render() {
    const {
      articles,
      articleList: {
        isFetching, ids, nextPageUrl
      }
    } = this.props;
    const articleList = ids.map(a => <ArticleListItem key={a} {...articles[a]} />);
    return (
      <div>
        <NavBar />
        <div className="home-content">
          <ul>
            {articleList}
          </ul>
          {nextPageUrl &&
            <div ref={this.loader} className="list-loader">
              <Cached color="#00bcd5" className={isFetching ? 'list-loading' : null} />加载中
            </div>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    entities: { articles },
    pagination: { articleList },
    ui: { app: { screenSize: { height } }, homePage: { curScroll } }
  } = state;
  return {
    curScroll,
    articles,
    articleList,
    screenHeight: height
  };
};

const { loadArticleList, updateLatestScroll, refreshAuthentication } = actions;

export default connect(mapStateToProps, {
  loadArticleList, updateLatestScroll, refreshAuthentication
})(HomePage);
