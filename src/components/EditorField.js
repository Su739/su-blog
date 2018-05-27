import React from 'react';
import PropTypes from 'prop-types';
import CodeMirror from './codemirror';

// const CodeMirror = window.CodeMirrorEditor; // eslint-disable-line no-undef

const Editor = (props) => {
  const { input } = props;
  return (
    <CodeMirror mode="markdown" theme="mdn-like" lineWrapping value={input.value} onChange={input.onChange} />
  );
};

Editor.propTypes = {
  input: PropTypes.objectOf(PropTypes.any)
};

export default Editor;
