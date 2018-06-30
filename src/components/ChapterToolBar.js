import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ChapterToolBar extends Component {
  static propTypes = {
    isChapter: PropTypes.bool
  };
  constructor(props) {
    super(props);
    this.state = {
      a: 'b'
    };
    /* this.addNewChapter = this.addNewChapter.bind(this);
    this.addNewArticle = this.addNewArticle.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this); */
  }
  render() {
    const { isChapter } = this.props;
    return (
      <span className="chapter-toolbar-wrapper">
        {isChapter ? (
          <span>
            <button
              onClick={this.addNewChapter}
              className="chapter-toolbar-btn"
              title="新建章节分类"
            >
              <i className="iconfont icon-18p icon-liebiao1">
                <i className="iconfont icon-sup-left icon-jia" />
              </i>
            </button>
            <button className="chapter-toolbar-btn" title="新建文章">
              <i className="iconfont icon-18p icon-file">
                <i className="iconfont icon-sup-left icon-jia" />
              </i>
            </button>
          </span>
        ) : null}
        <button onClick={this.handleEdit} className="chapter-toolbar-btn">
          <i className="iconfont icon-18p icon-pen_" />
        </button>
        <button onClick={this.handleDelete} className="chapter-toolbar-btn-danger">
          <i className="iconfont icon-18p icon-dustbin" />
        </button>
      </span>
    );
  }
}

export default ChapterToolBar;
