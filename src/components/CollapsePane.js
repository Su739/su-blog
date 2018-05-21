import React from 'react';
import PropTypes from 'prop-types';
import BookShelf from './BookShelf';
import Catalog from './Catalog';
import './CollapsePane.css';
import '../font/iconfont.css';
import { getCollapsibleInCatalog } from '../utils/getAncestorChapter';

class CollapsePane extends React.Component {
  static propTypes = {
    bookList: PropTypes.arrayOf(PropTypes.object),
    curBook: PropTypes.shape({
      name: PropTypes.string,
      catalog: PropTypes.arrayOf(PropTypes.object),
    }),
    loadContent: PropTypes.func,
    setEditBookId: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
      btnActived: [true, false],
      catalogStatus: getCollapsibleInCatalog(this.props.curBook.catalog), // 展开收起
    };
    this.shelfCollapse = this.shelfCollapse.bind(this);
    this.catalogCollapse = this.catalogCollapse.bind(this);
    this.closePane = this.closePane.bind(this);
    this.catalogToggle = this.catalogToggle.bind(this);
  }

  // --------------------------super boundary------------------------

  // toogle catalog collapse status
  catalogToggle(title) {
    this.setState(prevState => ({
      catalogStatus: Object.assign(prevState.catalogStatus, {
        [title]: !prevState.catalogStatus[title],
      }),
    }));
  }

  // shelf button
  shelfCollapse() {
    this.setState({
      // 折叠情况，点击任意一个都会展开，否则根据激活情况定
      collapse: this.state.collapse === true ? false : this.state.btnActived[0],
      btnActived: [true, false],
    });
  }
  // catalog button
  catalogCollapse() {
    this.setState({
      collapse: this.state.collapse === true ? false : this.state.btnActived[1],
      btnActived: [false, true],
    });
  }
  // close button
  closePane() {
    this.setState({
      collapse: true,
      btnActived: [true, false],
    });
  }

  // --------------------------super boundary------------------------

  render() {
    const [shelfActived, catalogActived] = this.state.btnActived;
    const {
      bookList, curBook, loadContent, setEditBookId,
    } = this.props;
    return (
      <div className={`absolute${this.state.collapse ? ' absolute-collapse' : ''}`}>
        <button className="close-btn" onClick={this.closePane}>
          ×
        </button>
        <button
          id="shelf-btn"
          className={`collapse-btn collapse-btn-first ${
            shelfActived ? 'collapse-btn-actived' : ''
          }`}
          onClick={this.shelfCollapse}
        >
          <i className="iconfont icon-book">
            <span className="icon-text">书架</span>
          </i>
        </button>
        <button
          id="catalog-btn"
          className={`collapse-btn collapse-btn-second ${
            catalogActived ? 'collapse-btn-actived' : ''
          }`}
          onClick={this.catalogCollapse}
        >
          <i className="iconfont icon-liebiao1">
            <span className="icon-text">目录</span>
          </i>
        </button>
        {shelfActived ? (
          <BookShelf bookList={bookList} setEditBookId={setEditBookId} />
        ) : null}
        {catalogActived ? (
          <Catalog
            curBook={curBook}
            catalogStatus={this.state.catalogStatus}
            catalogToggle={this.catalogToggle}
            loadContent={loadContent}
          />
        ) : null}
      </div>
    );
  }
}

export default CollapsePane;
