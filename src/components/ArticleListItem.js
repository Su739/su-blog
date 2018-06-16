import React from 'react';
import PropType from 'prop-types';
import { Link } from 'react-router-dom';
import './ArticleListItem.css';

const dateMap = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec'
};

const dateFormatter = (str) => {
  const arr = str.slice(0, 10).split('-');
  return `${dateMap[arr[1]]} ${arr[2]}, ${arr[0]}`;
};

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
