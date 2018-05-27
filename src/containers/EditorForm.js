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
    handleSubmit: PropTypes.func
  }
  componentDidMount() {
    const { articleid, loadArticle } = this.props;
    loadArticle(articleid);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.articleid !== this.props.articleid) {
      this.props.loadArticle(this.props.articleid);
    }
  }

  render() {
    console.log(this.props);
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Prompt
          when={this.props.dirty}
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

  const { entities: { articles } } = state;
  const article = articles && articles[articleid];

  return {
    articleid,
    initialValues: article
  };
};

const { loadArticle } = actions;

export default withRouter(connect(mapStateToProps, { loadArticle })(reduxForm({
  form: 'editorForm',
  enableReinitialize: true,
  onSubmit: submitArticle
})(EditorForm)));
