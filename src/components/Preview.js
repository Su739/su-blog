import React from 'react';
import PropTypes from 'prop-types';
import MarkdownPreviewer from 'react-markdown';
import CodeBlock from '../components/CodeBlock';
import './Preview.css';

const Preview = (props) => {
  const { article, isFetching } = props;
  return (
    <div className="preview-container">
      {
          isFetching
        ?
          <div>loading...</div>
        :
          <div>
            <h1 className="title">{article.title}</h1>
            <MarkdownPreviewer
              className="result"
              source={article && article.content}
              renderers={{ code: CodeBlock }}
            />
          </div>
        }
    </div>
  );
};

Preview.propTypes = {
  isFetching: PropTypes.bool,
  article: PropTypes.objectOf(PropTypes.any),
};

export default Preview;

