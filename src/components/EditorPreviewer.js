import React from 'react';
import PropTypes from 'prop-types';
import MarkdownPreviewer from 'react-markdown';
import CodeBlock from '../components/CodeBlock';

const Preview = (props) => {
  const { content, title } = props;
  return (
    <div>
      <h1 className="title">{title}</h1>
      <MarkdownPreviewer
        className="result"
        source={content}
        renderers={{ code: CodeBlock }}
      />
    </div>

  );
};

Preview.propTypes = {
  content: PropTypes.string,
  title: PropTypes.string
};

export default Preview;

