import React from 'react';
import PropTypes from 'prop-types';
import CodeMirror from './codemirror';

// const CodeMirror = window.CodeMirrorEditor; // eslint-disable-line no-undef

const Editor = props => (
  <form className="editor pure-form">
    <CodeMirror mode="markdown" theme="monokai" value={props.value} onChange={props.onChange} />
  </form>
);

Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
};

Editor.defaultProps = {
  value: ''
};

export default Editor;
