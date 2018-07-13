import React from 'react';
import PropTypes from 'prop-types';
import MarkdownPreviewer from 'react-markdown';
import CodeBlock from '../components/CodeBlock';
import dateFormatter from './utils/dateFormatter';
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
            <div className="preview-header">
              <h1 className="preview-header-title">{article.title}</h1>
              <p>
                <span className="preview-header-label">post:
                  <span style={{ color: 'orange' }}>
                    @{dateFormatter(article.createdAt)}
                  </span>
                </span>
                <span className="preview-header-label">update:
                  <span style={{ color: 'orange' }}>
                    @{dateFormatter(article.updatedAt)}
                  </span>
                </span>
              </p>
            </div>
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
  article: PropTypes.objectOf(PropTypes.any)
};

export default Preview;

