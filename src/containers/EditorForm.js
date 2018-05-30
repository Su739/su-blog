import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
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
    loadArticle: PropTypes.func,
    articleid: PropTypes.number,
    dirty: PropTypes.bool,
    handleSubmit: PropTypes.func,
    destroyNewArticle: PropTypes.func,
    hasTemp: PropTypes.bool,
    requestError: PropTypes.objectOf(PropTypes.any)
  }
  componentDidMount() {
    const { articleid, loadArticle, requestError } = this.props;
    if (!requestError) {
      loadArticle(articleid);
    }
  }
  componentDidUpdate(prevProps) {
    // -1是在新建文章时使用的id，要把他排除
    if (prevProps.articleid !== this.props.articleid && this.props.articleid !== -1) {
      this.props.loadArticle(this.props.articleid);
    }
  }

  render() {
    console.log(this.props);
    const {
      handleSubmit, dirty, hasTemp, requestError, destroyNewArticle
    } = this.props;
    if (requestError) {
      return <div>{requestError.message}</div>;
    }
    return (
      <form onSubmit={() => { destroyNewArticle(); handleSubmit(); }}>
        <Prompt
          when={dirty || hasTemp}
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
  const { articleid } = ownProps.match.params;

  const { entities: { articles }, tempData: { article: tempArticle }, requestError } = state;
  const article = tempArticle || (articles && articles[articleid]);
  const hasTemp = !!tempArticle;

  return {
    articleid: parseInt(articleid, 10),
    initialValues: article,
    requestError,
    hasTemp
  };
};

const { loadArticle, destroyNewArticle, loadBook } = actions;

export default withRouter(connect(mapStateToProps, { loadArticle, destroyNewArticle })(reduxForm({
  form: 'editorForm',
  enableReinitialize: true,
  onSubmit: submitArticle,
  onSubmitSuccess: (result, dispatch) => {
    dispatch(loadBook(result.bookid));
  }
})(EditorForm)));
