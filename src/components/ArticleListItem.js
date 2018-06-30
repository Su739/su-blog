import React from 'react';
import PropType from 'prop-types';
import { Link } from 'react-router-dom';
import dateFormatter from './utils/dateFormatter';
import './ArticleListItem.css';

const ArticleListItem = (props) => {
  const {
    title, updatedAt, abstract, writer, id, parent
  } = props;
  return (
    <li className="a-li">
      <Link className="a-li-title" to={`/${writer}/book/${parent}/a/${id}`}>{title}</Link>
      <p className="a-li-writer-date">
        <Link className="a-li-writer" to={`/${writer}`}>{writer}</Link>
        <span className="a-li-post"> posted @ </span>{dateFormatter(updatedAt)}
      </p>
      <p className="a-li-abstract">{abstract}</p>
      <hr className="a-li-sparator" />
    </li>
  );
};

ArticleListItem.propTypes = {
  title: PropType.string,
  updatedAt: PropType.string,
  abstract: PropType.string,
  writer: PropType.string,
  id: PropType.number,
  parent: PropType.number
};

export default ArticleListItem;
