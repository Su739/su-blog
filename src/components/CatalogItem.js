import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Delete from 'material-ui/svg-icons/action/delete';
import Add from 'material-ui/svg-icons/content/add';
import Collapse from 'material-ui/svg-icons/navigation/chevron-right';
import Expand from 'material-ui/svg-icons/navigation/expand-more';


const ItemTools = (props) => {
  const { newArticle, deleteArticle, allowAddNew } = props;
  return (
    <IconMenu
      iconButtonElement={
        <IconButton style={{ transition: 'none' }}>
          <MoreVertIcon />
        </IconButton>
      }
      iconStyle={{ transition: 'none' }}
      style={{ color: '#000' }}
      targetOrigin={{ horizontal: 'middle', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {allowAddNew ? <MenuItem onClick={newArticle} leftIcon={<Add />} primaryText="新文章" /> : null}
      <MenuItem onClick={deleteArticle} leftIcon={<Delete />} primaryText="删除" />
    </IconMenu>
  );
};
ItemTools.propTypes = {
  newArticle: PropTypes.func,
  deleteArticle: PropTypes.func,
  allowAddNew: PropTypes.bool
};

// store 中维护被选中状态，折叠状态由自己的state维护
class CatalogItem extends React.Component {
  static propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    bookid: PropTypes.number,
    url: PropTypes.string,
    title: PropTypes.string,
    depth: PropTypes.number,
    toggleExpandBtn: PropTypes.func,
    handleToggleCatalog: PropTypes.func,
    id: PropTypes.number,
    expanded: PropTypes.objectOf(PropTypes.bool),
    expandable: PropTypes.objectOf(PropTypes.bool),
    superior: PropTypes.number,
    isEditor: PropTypes.bool,
    bySuperior: PropTypes.objectOf(PropTypes.number),
    hasNewArticle: PropTypes.bool,
    toggleBlockedModal: PropTypes.func,
    addArticle: PropTypes.func,
    addBlockedArticle: PropTypes.func,
    onArticleDeleteClick: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.onExpandClick = this.onExpandClick.bind(this);
  }

  onExpandClick() {
    const { toggleExpandBtn, id } = this.props;
    toggleExpandBtn(id);
  }

  // 去掉98行的onMouseDown,点击react调试中的highlight会发现，item是不会重新渲染的。。
  // 这里的navlink滞后是因为挂了onMouseDown这个，每次都会更改state重新渲染，不然navlink的activeStyle会根本一点作用不起
  // 所以还要自己写selected。。。暂时没写，先写editor去
  render() {
    const {
      expanded, isEditor, expandable, bySuperior, hasNewArticle,
      url, title, depth, id, superior, bookid, history,
      handleToggleCatalog, toggleBlockedModal,
      addBlockedArticle, addArticle, onArticleDeleteClick
    } = this.props;
    if (isEditor) {
      // 新建文章
      const newArticle = () => {
        // 当前存在未保存的"新文章", 此时弹出模态框提供选择
        if (hasNewArticle) {
          addBlockedArticle(-1, depth + 1, bySuperior[id] ? bySuperior[id] + 1 : 1, id, '未命名', '\n\n\n\n\n\n\n\n', bookid, true);
          toggleBlockedModal(true);
        } else { // 立即新建一个文章
          addArticle(-1, depth + 1, bySuperior[id] ? bySuperior[id] + 1 : 1, id, '未命名', '\n\n\n\n\n\n\n\n', bookid, true);
          history.push(url.replace(/\/[^/]*$/, '/-1'));
        }
      };

      // 只有editor才会padding-left 7%，所以没写在类里
      return (
        <div className="catalog-item" style={{ paddingLeft: `${depth * 12}px` }}>
          <div style={{ paddingLeft: '7%' }} className="catalog-item-link">
            <NavLink style={superior !== 0 ? { color: '#999' } : { color: '#000' }} activeStyle={{ color: '#007bff' }} to={url}>
              {title}
            </NavLink>
          </div>
          <div className="catalog-item-tool">
            {superior !== -1 && <ItemTools // 暂时不允许删除前言。。
              newArticle={newArticle}
              allowAddNew={id !== -1} // 不允许在新建文章下面建子文章
              deleteArticle={() => onArticleDeleteClick(id)}
            />}
          </div>
        </div>
      );
    }
    return (
      <div className="catalog-item" style={{ paddingLeft: `${depth * 12}px` }}>
        {expandable[id]
        ?
          <button className="catalog-item-expand-btn" onClick={this.onExpandClick}>
            {expanded[id]
            ?
              <Expand style={{ color: 'rgba(40, 40, 40, 0.7)' }} />
            :
              <Collapse style={{ color: 'rgba(40, 40, 40, 0.7)' }} />}
          </button>
        :
          <div style={{ width: '36px' }} />}
        <div className="catalog-item-link" onClick={() => handleToggleCatalog(false)} role="presentation">
          <NavLink style={superior !== 0 ? { color: '#999' } : { color: '#000' }} activeStyle={{ color: '#007bff' }} to={url}>
            {title}
          </NavLink>
        </div>
      </div>
    );
  }
}

export default CatalogItem;
