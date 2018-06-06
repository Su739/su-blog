import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import IconButton from 'material-ui/IconButton';
import SwapHoriz from 'material-ui/svg-icons/action/swap-horiz';
import Help from 'material-ui/svg-icons/action/help';
import Image from 'material-ui/svg-icons/image/image';
import Save from 'material-ui/svg-icons/content/save';
import CircularProgress from 'material-ui/CircularProgress';
import actions from '../../actions';
import CatalogContainer from '../CatalogContainer';
import EditorForm from '../EditorForm';
import EditorPreviewer from '../../components/EditorPreviewer';
import Error404 from '../../components/Error404';
import EditorLoadingPage from '../../components/EditorLoadingPage';
import './EditorPage.css';

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
  componentDidMount() {
    const {
      requestError, loadBook, loadingEditor, bookid, initialEditingData
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
    if (!requestError) {
      loadBook(bookid)
        .then((res) => {
          if (!res.requestError) {
            const { books, articles } = res.response.entities;
            initialEditingData(articles, books);
            loadingEditor(false);
          }
        });
    }
  }

  componentDidUpdate(prevProps) {
    // 在显示错误页的组件中，我觉得都应该这么写，不然如果数据已经加载成功，就会卡在错误页
    // componentDidUpdate是‘更新发生时‘立即执行，第二个条件也是遇到问题才写上的，意味着第二次请求又有错,
    // 但是也不确定prevProps.requestError && !this.props.requestError这个是正确的,（基本肯定是错误的，因为下个状态如果load过就得不到更新）
    if (prevProps.requestError) {
      this.props.resetRequestError();
    }
    if (prevProps.bookid !== this.props.bookid) {
      this.props.loadBook(this.props.bookid);
    }
  }

  componentWillUnmount() {
    // 销毁editingData
  }
  render() {
    console.log(this.props);
    const {
      toggleBlockedModal, submitArticle, hasNewArticle, displayBlockedModal,
      match, isLogged, isFetching, formValues, requestError, loading, history
    } = this.props;
    if (requestError) {
      return <Error404 statusCode={requestError.status} message={requestError.message} />;
    }
    if (isLogged) {
      return (
        loading ?
          <EditorLoadingPage />
          :
          <div className="editor-page">
            <CatalogContainer
              // 当将history传入进去后，之前的navlink active就会起作用，因为每次点击之后history会变，座椅catalog会re-render
              history={history}
              url={`/${match.params.username}/book/${match.params.bookid}/~/edit`}
              isEditor
              bookid={parseInt(match.params.bookid, 10)}
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
                  <Route path="/:username/book/:bookid/~/edit/:articleid" component={EditorForm} />
                  <Route exact path="/:username/book/:bookid/~/edit" component={EditorForm} />
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
                    <ToolButton onClick={submitArticle} tooltip="保存提交">
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
      );
    }
    return (<Redirect to={`/${match.params.username}`} />);
  }
}

EditorPage.propTypes = {
  history: PropTypes.objectOf(PropTypes.any),
  loadBook: PropTypes.func,
  loadingEditor: PropTypes.func,
  resetRequestError: PropTypes.func,
  bookid: PropTypes.number,
  initialEditingData: PropTypes.func,
  match: PropTypes.shape({
    isExact: PropTypes.bool,
    params: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }),
  isLogged: PropTypes.bool,
  isFetching: PropTypes.bool,
  formValues: PropTypes.objectOf(PropTypes.any),
  submitArticle: PropTypes.func,
  requestError: PropTypes.objectOf(PropTypes.any),
  toggleBlockedModal: PropTypes.func,
  displayBlockedModal: PropTypes.bool,
  loading: PropTypes.bool,
  hasNewArticle: PropTypes.bool
};

const mapStateToProps = (state, ownProps) => {
  const { articleid, bookid } = ownProps.match.params;
  const {
    // entities: { books, articles },
    auth: { isLogged, loginName },
    ui: { editor: { isFetching, loading }, popwindow: { displayBlockedModal } },
    form,
    requestError,
    editingData: { articlesById, hasNewArticle }
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
    // articleid: parseInt(articleid, 10) || parseInt(readmeid, 10),
    bookid: parseInt(bookid, 10),
    isLogged,
    isFetching,
    loading,
    formValues,
    requestError,
    hasNewArticle,
    displayBlockedModal
  };
};

const {
  loadBook, loadArticle, loadingEditor, initialEditingData, resetRequestError
} = actions;
const submitArticle = () => submit('editorForm');

export default withRouter(connect(mapStateToProps, {
  submitArticle, loadBook, loadArticle, loadingEditor, initialEditingData, resetRequestError
})(EditorPage));
