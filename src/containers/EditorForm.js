import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, blur } from 'redux-form';
import { connect } from 'react-redux';
import { Prompt, withRouter } from 'react-router-dom';
import axios from 'axios';
import actions from '../actions';
import { MaterialToogleField } from '../components/reduxFormFieldComponent/MaterialField';
import EditorField from '../components/EditorField';
import EditorTitleField from '../components/EditorTitleFied';
import rootUrl from '../utils/rootUrl';

export const submitArticle = ({
  id, title, depth, order, parent, superior, content, ispublic, writerid, abstract
}) =>
  axios.post(`${rootUrl}/api/articles/article`, {
    id, title, depth, order, parent, superior, content, ispublic, writerid, abstract
  }, { withCredentials: true });

class EditorForm extends React.Component {
  static propTypes = {
    location: PropTypes.objectOf(PropTypes.any),
    articlesById: PropTypes.objectOf(PropTypes.object),
    initialValues: PropTypes.objectOf(PropTypes.any),
    loadArticle: PropTypes.func,
    updateArticle: PropTypes.func,
    articleid: PropTypes.number,
    dirty: PropTypes.bool,
    handleSubmit: PropTypes.func,
    destroyNewArticle: PropTypes.func,
    resetRequestError: PropTypes.func,
    requestError: PropTypes.objectOf(PropTypes.any)
  }
  componentDidMount() {
    // 最终还是要在editorPage didMount时loadArticle，
    // 这个请求是安全，因为在loadBook完成之前，渲染的白屏，不会加载editorForm。。。然而也不会加载当前这个组件
    const {
      articleid, loadArticle, requestError, updateArticle, initialValues
    } = this.props;
    // 第二个条件，没有使用articleid === -1， 因为在没有新建文章时请求-1需要他报404错，而initialValues.id确定的是editingdata中是否有新文章
    // 由于entities中不会出现新建的文章，所以即使存在新建文章loadXXX中不会返回null，而是去请求-1这个文章
    // 第三个条件确定文章内容没有加载的情况下才会请求文章，不然返回null then报错
    if (!requestError && (!initialValues || !initialValues.content)) {
      if (!initialValues || initialValues.id !== -1) {
        loadArticle(articleid).then((res) => {
          if (!res.requestError) {
            const {
              id, depth, order, superior, title, content, parent, public: ispublic
            } = res.response.entities.articles[articleid];
            updateArticle({
              // 哎～字段里用了js保留字public，应该该过来。。。
              id, depth, order, superior, title, content, parent, public: ispublic
            });
          }
        });
      }
    }
  }
  componentDidUpdate(prevProps) {
    // 在不提交的情况下，恢复之前访问的文章的状态。。。可能还需要改进，但我不知道怎么改们只能等遇到问题
    // 已更改一次，只有在没有删除上一次访问(编辑)的article，才会还原
    if (this.props.location.pathname !== prevProps.location.pathname
      && this.props.articlesById[prevProps.initialValues.id]) {
      prevProps.updateArticle(prevProps.initialValues);
    }
    // -1是在新建文章时使用的id，要把他排除,如果已经加载内容loadArticle，要过滤掉，不然返回null，then会报错
    if (prevProps.articleid !== this.props.articleid) {
      // 这个作用是清楚requestError，不然就算更改location，也会一直卡在错误页
      if (prevProps.requestError) {
        this.props.resetRequestError();
      }
      if (!this.props.initialValues || !this.props.initialValues.content) {
        this.props.loadArticle(this.props.articleid).then((res) => {
          if (!res.requestError) {
            const {
              id, content // , depth, order, superior, title, parent, public: ispublic
            } = res.response.entities.articles[this.props.articleid];
            this.props.updateArticle({ id, content });
            // 我觉得传入一个完整的文章比较好
            // this.props.updateArticle(res.response.entities.articles[this.props.articleid]);
          }
        });
      }
    }
  }

  render() {
    const {
      handleSubmit, dirty, requestError, destroyNewArticle, updateArticle, initialValues
    } = this.props;
    if (requestError) {
      return <div>{requestError.message}</div>;
    }
    return (
      <form style={{ position: 'relative' }} onSubmit={() => { destroyNewArticle(); handleSubmit(); }}>
        <Prompt
          when={dirty}
          message={location =>
            `Are you sure you want to go to ${location.pathname}`
          }
        />
        <div className="editor-float-pane">
          <Field
            name="title"
            component={EditorTitleField}
            label="标题："
            type="text"
            placeholder="输入标题..."
            onBlur={(e) => {
              updateArticle({ id: initialValues.id, title: e.target.value });
            }}
          />
          <Field
            style={{
              width: 'auto', margin: '5px 0'
            }}
            id="ispublic"
            label="对所有人可见"
            name="ispublic"
            component={MaterialToogleField}
            type="checkbox"
          />
          <Field
            className="editor-abstract"
            rows="3"
            wrap="hard"
            maxlength="200"
            name="abstract"
            component="textarea"
          />
        </div>
        <Field name="id" component="input" type="hidden" />
        <Field name="depth" component="input" type="hidden" />
        <Field name="order" component="input" type="hidden" />
        <Field name="parent" component="input" type="hidden" />
        <Field name="superior" component="input" type="hidden" />
        <Field
          name="content"
          component={EditorField}
        />
      </form>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { articleid, bookid, username } = ownProps.match.params;

  const {
    entities: { books, articles, users },
    editingData: { articlesById, newArticle },
    requestError
  } = state;
  const writerid = users[username].id;
  let readmeid = null;
  /*
  if (!articleid) {
    // books[bookid].articles这句可以判断loadBook是否执行完成, 总感觉要想想其他办法，不这么干
    // 需要使用books，不然如果已经加载了多个book会有多个-1article
    if (booksById && booksById[bookid] && booksById[bookid].articles) {
      ([readmeid] = booksById[bookid].articles.filter(a => articlesById[a].superior === -1));
      // throw new Error('book最少有一篇depth为-1的readme');
    }
  } */

  if (!articleid) {
    // books[bookid].articles这句可以判断loadBook是否执行完成, 总感觉要想想其他办法，不这么干
    // 需要使用books，不然如果已经加载了多个book会有多个-1article
    if (books && books[bookid] && books[bookid].articles) {
      ([readmeid] = books[bookid].articles.filter(a => articles[a].superior === -1));
      // throw new Error('book最少有一篇depth为-1的readme');
    }
  }

  // 无论已经在editingData加载了多少本书，只有一个新建文章，并且他的id为-1
  const article = (parseInt(articleid, 10) === -1 && newArticle)
    || (articles && articles[articleid || readmeid]);

  return {
    articleid: parseInt(articleid, 10) || parseInt(readmeid, 10),
    initialValues: { ...article, writerid },
    articlesById,
    requestError
  };
};

const {
  loadArticle, removeArticle, resetRequestError, updateArticle
} = actions;

export default withRouter(connect(mapStateToProps, {
  loadArticle, removeArticle, updateArticle, blur, resetRequestError
})(reduxForm({
  form: 'editorForm',
  // When set to true, the form will reinitialize every time the initialValues prop changes
  enableReinitialize: true,
  onSubmit: submitArticle,
  onSubmitSuccess: (result, dispatch, props) => {
    const article = Array.isArray(result.data) ? result.data[0] : result.data;
    const { username, bookid, articleid } = props.match.params;
    // 在这里destroy而不是在提交时的原因，是如果提交时destory
    // dispatch(loadBook(article.parent));
    dispatch(loadArticle(article.id, true));
    dispatch(removeArticle(-1));
    dispatch(updateArticle(article));
    if (articleid === -1) {
      props.history.replace(`/${username}/book/${bookid}/~/edit/${article.id}`);
    }
  }
})(EditorForm)));
