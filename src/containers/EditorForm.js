import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, blur } from 'redux-form';
import { connect } from 'react-redux';
import { Prompt, withRouter } from 'react-router-dom';
import axios from 'axios';
import actions from '../actions';
import EditorField from '../components/EditorField';
import rootUrl from '../utils/rootUrl';

export const submitArticle = ({
  title, writerid, depth, order, parent, superior, content
}) =>
  axios.post(`${rootUrl}/api/articles/article`, {
    title, writerid, depth, order, parent, superior, content
  }, { withCredentials: true });

class EditorForm extends React.Component {
  static propTypes = {
    articlesById: PropTypes.arrayOf(PropTypes.object),
    initialValues: PropTypes.objectOf(PropTypes.any),
    loadArticle: PropTypes.func,
    updateArticle: PropTypes.func,
    articleid: PropTypes.number,
    dirty: PropTypes.bool,
    handleSubmit: PropTypes.func,
    destroyNewArticle: PropTypes.func,
    requestError: PropTypes.objectOf(PropTypes.any)
  }
  componentDidMount() {
    // 最终还是要在editorPage didMount时loadArticle，
    // 这个请求是安全，因为在loadBook完成之前，渲染的白屏，不会加载editorForm。。。然而也不会加载当前这个组件
    const {
      articleid, loadArticle, requestError, updateArticle, initialValues
    } = this.props;
    console.log(this.props);
    // 第二个条件，没有使用articleid === -1， 因为在没有新建文章时请求-1需要他报404错，而initialValues.id确定的是editingdata中是否有新文章
    // 由于entities中不会出现新建的文章，所以即使存在新建文章loadXXX中不会返回null，而是去请求-1这个文章
    if (!requestError && (!initialValues || initialValues.id !== -1)) {
      loadArticle(articleid).then((res) => {
        if (!res.requestError) {
          console.log(res);
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
  componentDidUpdate(prevProps) {
    console.log(prevProps);
    // 在不提交的情况下，恢复之前访问的文章的状态。。。可能还需要改进，但我不知道怎么改们只能等遇到问题
    // 已更改一次，只有在没有删除上一次访问(编辑)的article，才会还原
    if (this.props.location !== prevProps.location && this.props.articlesById[prevProps.initialValues.id]) {
      prevProps.updateArticle(prevProps.initialValues);
    }
    // -1是在新建文章时使用的id，要把他排除,如果已经加载内容loadArticle，要过滤掉，不然返回null，then会报错
    if (prevProps.articleid !== this.props.articleid &&
      this.props.articleid !== -1) {
      if (!this.props.initialValues.content) {
        this.props.loadArticle(this.props.articleid).then((res) => {
          if (!res.requestError) {
            console.log(res);
            const {
              id, content // , depth, order, superior, title, parent, public: ispublic
            } = res.response.entities.articles[this.props.articleid];
            this.props.updateArticle({ id, content });
          }
        });
      }
    }
  }

  render() {
    console.log(this.props);
    const {
      handleSubmit, dirty, requestError, destroyNewArticle, updateArticle, initialValues
    } = this.props;
    if (requestError) {
      return <div>{requestError.message}</div>;
    }
    return (
      <form onSubmit={() => { destroyNewArticle(); handleSubmit(); }}>
        <Prompt
          when={dirty}
          message={location =>
            `Are you sure you want to go to ${location.pathname}`
          }
        />
        <div>
          <Field
            name="title"
            component="input"
            type="text"
            placeholder="输入标题..."
            onBlur={(e) => {
              updateArticle({ id: initialValues.id, title: e.target.value });
            }}
          />
        </div>
        <Field name="writerid" component="input" type="hidden" />
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
  const { articleid, bookid } = ownProps.match.params;

  const {
    entities: { books, articles },
    editingData: { articlesById, booksById },
    requestError
  } = state;
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
  const article = (parseInt(articleid, 10) === -1 && articlesById[-1])
    || (articles && articles[articleid || readmeid]);

  return {
    articleid: parseInt(articleid, 10) || parseInt(readmeid, 10),
    initialValues: article,
    articlesById,
    requestError
  };
};

const {
  loadArticle, destroyNewArticle, loadBook, updateArticle
} = actions;

export default withRouter(connect(mapStateToProps, {
  loadArticle, destroyNewArticle, updateArticle, blur
})(reduxForm({
  form: 'editorForm',
  // When set to true, the form will reinitialize every time the initialValues prop changes
  enableReinitialize: true,
  onSubmit: submitArticle,
  onSubmitSuccess: (result, dispatch) => {
    // 在这里destroy而不是在提交时的原因，是如果提交时destory
    dispatch(loadBook(result.bookid));
    dispatch(destroyNewArticle());
  }
})(EditorForm)));
