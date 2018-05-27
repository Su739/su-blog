import React from 'react';
import PropTypes from 'prop-types';
import MarkdownPreviewer from 'react-markdown';
import Editor from './Editor';
import CodeBlock from './CodeBlock';
// import placeholder from './utils/placeholder';

class TrackEditor extends React.Component {
  static propTypes = {
    content: PropTypes.string,
    onContentChange: PropTypes.func
  };
  /* static defaultProps = {
    content: placeholder,
  }; */
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.props.onContentChange(e);
  }
  render() {
    const { content } = this.props;
    return (
      <div className="track-deitor">
        <div className="editor-pane">
          <Editor value={content} onChange={this.handleChange} />
        </div>
        <div className="previewer-pane">
          <MarkdownPreviewer className="result" source={content} renderers={{ code: CodeBlock }} />
        </div>
      </div>
    );
  }
}

export default TrackEditor;
