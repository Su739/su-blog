import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import axios from 'axios';
import IconButton from 'material-ui/IconButton';
import SwapHoriz from 'material-ui/svg-icons/action/swap-horiz';
import Help from 'material-ui/svg-icons/action/help';
import Image from 'material-ui/svg-icons/image/image';
import Save from 'material-ui/svg-icons/content/save';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';
import Modal from '../../components/Modal';
import BlockedArticleDialog from '../BlockedArticleDialog';
import actions from '../../actions';
import CatalogContainer from '../CatalogContainer';
import EditorForm from '../form/EditorForm';
import EditorPreviewer from '../../components/EditorPreviewer';
import Error404 from '../../components/Error404';
import EditorLoadingPage from '../../components/EditorLoadingPage';
import rootUrl from '../../utils/rootUrl';
import './EditorPage.css';


const deleteArticleById = id =>
  axios.delete(`${rootUrl}/api/a/${id}`, { withCredentials: true });

const ToolButton = props => (
  <IconButton
    iconStyle={{ width: '24px', height: '24px', padding: '0' }}
    tooltipPosition="top-right"
    tooltip={props.tooltip}
    hoveredStyle={{ backgroundColor: '#ddd' }}
    tooltipStyles={{ transition: 'none' }}
    style={{
      borderRadius: '4px', width: 'none', height: 'none', padding: '3px', margin: '6px 0'
    }}
    onClick={props.onClick}
  >
    {props.children}
  </IconButton>
);
ToolButton.propTypes = {
  children: PropTypes.node,
  tooltip: PropTypes.string,
  onClick: PropTypes.func
};

class EditorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      snackbarMessage: '',
      deleteArticleWarning: false
    };
    this.updateMessage = this.updateMessage.bind(this);
    this.onArticleDeleteClick = this.onArticleDeleteClick.bind(this);
    this.executeDelete = this.executeDelete.bind(this);
    this.cancelDelete = this.cancelDelete.bind(this);
    this.deleteSuccess = this.deleteSuccess.bind(this);
  }
  componentDidMount() {
    const {
      loadBook, loadingEditor, bookid, initialEditingData, books, articles, refreshAuthentication
    } = this.props;
    // 当通过输入栏手动输入url或者点击写文章按钮时，url中不含有articleid参数，而且很可能这时候也没有加载book，
    // 导致暂时无法获得书中superior为-1的项(readme文章，现在还没有好办法，就用了这个办法)
    /*
    if (Number.isNaN(articleid)) {
      loadBook(bookid)
        .then((res) => {
          loadArticle(res.response.entities.books[bookid].articles
            .filter(a => res.response.entities.articles[a].superior === -1)[0])
            .then(() => {
              initialEditingData();
              loadingEditor(false);
            });
        });
    } else {
      Promise.all([loadBook(bookid), loadArticle(articleid)]).then(() => loadingEditor(false));
    }
    */
    // 刷新登录状态
    refreshAuthentication();
    if (books[bookid] && books[bookid].articles) {
      initialEditingData(articles, books);
      loadingEditor(false);
    } else {
      loadBook(bookid)
        .then((res) => {
          if (!res.requestError) {
            const { books: resBooks, articles: resArticles } = res.response.entities;
            initialEditingData(resArticles, resBooks);
            loadingEditor(false);
          }
        });
    }
  }

  componentDidUpdate(prevProps) {
    // url改变，复位请求错误
    if (prevProps.articleid !== this.props.articleid) {
      if (prevProps.requestError) {
        this.props.resetRequestError();
      }
    }
    // 在显示错误页的组件中，我觉得都应该这么写，不然如果数据已经加载成功，就会卡在错误页
    // componentDidUpdate是‘更新发生时‘立即执行，第二个条件也是遇到问题才写上的，意味着第二次请求又有错,
    // 但是也不确定prevProps.requestError && !this.props.requestError这个是正确的,（基本肯定是错误的，因为下个状态如果load过就得不到更新）
    // 要把清理上次请求错误写在判断内部，不然如果比他等级低的组件dispatch一个requestError，这个组件的状态会被更新，然后又把这个requestError清楚掉，造成无限循环
    if (prevProps.bookid !== this.props.bookid) {
      if (prevProps.requestError) {
        this.props.resetRequestError();
      }
      this.props.loadBook(this.props.bookid);
    }
  }

  componentWillUnmount() {
    // 销毁editingData
    this.props.destroyDeitingData();
    // 这个很重要，不然下次在加载数据完成之前，没有他阻塞，就会报错(数据不存在)
    this.props.loadingEditor(true);
  }

  onArticleDeleteClick(id) {
    this.props.addDeletingArticles(id);
    this.setState({ deleteArticleWarning: true });
  }

  updateMessage(open, message) {
    this.setState({
      open,
      snackbarMessage: message
    });
  }

  cancelDelete() {
    this.props.destroyDeletingArticles();
    this.setState({ deleteArticleWarning: false });
  }

  executeDelete() {
    const { deletingArticles } = this.props;
    if (deletingArticles[0] !== -1) {
      return deleteArticleById(deletingArticles[0]);
    }
    return Promise.resolve({ data: { id: -1 } });
  }

  deleteSuccess(res) {
    const {
      removeArticle, articleid, history, deleteArticleEntity
    } = this.props;

    this.setState({ open: true, snackbarMessage: `id为: ${res.data.id} 的文章删除成功` });
    // 这个顺序会影响目录的生成
    if (parseInt(articleid, 10) === parseInt(res.data.id, 10)) {
      history.goBack();
    }

    // 这个顺序会影响目录的生成
    removeArticle(res.data.id);
    if (res.data.id !== -1) {
      deleteArticleEntity(res.data.id, res.data.parent);
    }
  }

  render() {
    const {
      submitArticle, match, isLogged, isFetching, formValues, requestError, loading
    } = this.props;
    if (requestError) {
      return <Error404 statusCode={requestError.status} message={requestError.message} />;
    }
    if (loading) {
      return <EditorLoadingPage />;
    }
    return (
      isLogged ?
        <div className="editor-page">
          <Snackbar
            open={!!this.state.open}
            message={this.state.snackbarMessage}
            autoHideDuration={10000}
            onRequestClose={() => this.setState({ open: false, snackbarMessage: '' })}
          />
          <BlockedArticleDialog />
          <Modal
            maskClose
            closeCB={this.cancelDelete}
            display={this.state.deleteArticleWarning}
            tips="确定要删除这篇文章么？"
            okText="确定"
            cancelText="取消"
            onOkClick={this.executeDelete}
            onCancelClick={this.cancelDelete}
            resolvedCB={res => this.deleteSuccess(res)}
          />
          <CatalogContainer
            url={`/${match.params.username}/book/${match.params.bookid}/~/edit`}
            isEditor
            onArticleDeleteClick={this.onArticleDeleteClick}
          />
          <div className="editor-and-previewer">
            {
                isFetching &&
                <div className="editor-loading-mask">
                  <div className="editor-loading-wrapper">
                    <div className="editor-loading-box">
                      <CircularProgress size={150} thickness={7} />
                    </div>
                  </div>
                </div>
              }
            <div className="editor-container">
              <Switch>
                <Route
                  path="/:username/book/:bookid/~/edit/:articleid*"
                  render={() => <EditorForm updateMessage={this.updateMessage} />}
                />
                <Route path="/" component={Error404} />
              </Switch>
            </div>
            <div className="tool-wall">
              <div className="tool-box">
                <div className="tool-box-top">
                  <ToolButton tooltip="交换窗口位置">
                    <SwapHoriz />
                  </ToolButton>
                  <ToolButton tooltip="上传图片">
                    <Image />
                  </ToolButton>
                  <ToolButton tooltip="语法提示">
                    <Help />
                  </ToolButton>
                </div>
                <div className="tool-box-bottom">
                  <ToolButton onClick={() => { this.updateMessage(true, '文章提交中...'); submitArticle(); }} tooltip="保存提交">
                    <Save color="#007bff" />
                  </ToolButton>
                </div>
              </div>
            </div>
            <div className="editor-previewer">
              <EditorPreviewer content={formValues ? formValues.content : 'loading...'} title={formValues ? formValues.title : ''} />
            </div>
          </div>
        </div>
        :
        <Redirect to={`/${match.params.username}`} />
    );
  }
}

EditorPage.propTypes = {
  books: PropTypes.objectOf(PropTypes.any),
  articles: PropTypes.objectOf(PropTypes.any),
  articleid: PropTypes.number,
  refreshAuthentication: PropTypes.func,
  loadBook: PropTypes.func,
  loadingEditor: PropTypes.func,
  resetRequestError: PropTypes.func,
  bookid: PropTypes.number,
  initialEditingData: PropTypes.func,
  destroyDeitingData: PropTypes.func,
  deletingArticles: PropTypes.arrayOf(PropTypes.number),
  destroyDeletingArticles: PropTypes.func,
  addDeletingArticles: PropTypes.func,
  deleteArticleEntity: PropTypes.func,
  removeArticle: PropTypes.func,
  match: PropTypes.shape({
    isExact: PropTypes.bool,
    params: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }),
  history: PropTypes.objectOf(PropTypes.any),
  isLogged: PropTypes.bool,
  isFetching: PropTypes.bool,
  formValues: PropTypes.objectOf(PropTypes.any),
  submitArticle: PropTypes.func,
  requestError: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.bool
};

const mapStateToProps = (state, ownProps) => {
  const { articleid, bookid, username } = ownProps.match.params;
  const {
    entities: { books, articles },
    auth: { loginName },
    ui: { editorPage: { isFetching, loading, displayBlockedModal } },
    form,
    requestError,
    editingData: { hasNewArticle },
    deletingData: { deletingArticles }
  } = state;
  const formValues = form && form.editorForm && form.editorForm.values;
  /*
  let readmeid = null;
  if (!articleid) {
    // books[bookid].articles这句可以判断loadBook是否执行完成, 总感觉要想想其他办法，不这么干
    // 需要使用books，不然如果已经加载了多个book会有多个 superior为-1 的article
    if (books && books[bookid] && books[bookid].articles) {
      ([readmeid] = books[bookid].articles.filter(a => articles[a].superior === -1));
      // throw new Error('book最少有一篇depth为-1的readme');
    }
  } */

  return {
    books,
    articles,
    // articleid: parseInt(articleid, 10) || parseInt(readmeid, 10),
    bookid: parseInt(bookid, 10),
    articleid: parseInt(articleid, 10),
    isLogged: loginName === username,
    isFetching,
    loading,
    formValues,
    requestError,
    hasNewArticle,
    deletingArticles,
    displayBlockedModal
  };
};


// removeArticle是删除editingData中的article，名字不太贴切。。。
const {
  loadBook, loadArticle, loadingEditor, initialEditingData, deleteArticleEntity,
  addDeletingArticles, destroyDeitingData, resetRequestError, refreshAuthentication,
  destroyDeletingArticles, removeArticle
} = actions;
const submitArticle = () => submit('editorForm');

export default withRouter(connect(mapStateToProps, {
  submitArticle,
  loadBook,
  loadArticle,
  loadingEditor,
  initialEditingData,
  resetRequestError,
  addDeletingArticles,
  destroyDeitingData,
  destroyDeletingArticles,
  deleteArticleEntity,
  removeArticle,
  refreshAuthentication
})(EditorPage));
