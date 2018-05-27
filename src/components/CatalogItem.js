import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Delete from 'material-ui/svg-icons/action/delete';
import Pen from 'material-ui/svg-icons/editor/border-color';
import Add from 'material-ui/svg-icons/content/add';
import Collapse from 'material-ui/svg-icons/navigation/chevron-right';
import Expand from 'material-ui/svg-icons/navigation/expand-more';


const ItemTools = (props) => {
  const { toolMethod: { newArticle, editArticle, deleteArticle } } = props;
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
      <MenuItem onClick={newArticle} leftIcon={<Add />} primaryText="新文章" />
      <MenuItem onClick={editArticle} leftIcon={<Pen />} primaryText="编辑" />
      <Divider />
      <MenuItem onClick={deleteArticle} leftIcon={<Delete />} primaryText="删除" />
    </IconMenu>
  );
};
ItemTools.propTypes = {
  toolMethod: PropTypes.shape({
    newArticle: PropTypes.func,
    editArticle: PropTypes.func,
    deleteArticle: PropTypes.func
  })
};

// store 中维护被选中状态，折叠状态由自己的state维护
class CatalogItem extends React.Component {
  static propTypes = {
    toolMethods: PropTypes.shape({
      newArticle: PropTypes.func,
      editArticle: PropTypes.func,
      deleteArticle: PropTypes.func
    }),
    url: PropTypes.string,
    selected: PropTypes.bool,
    title: PropTypes.string,
    depth: PropTypes.number,
    toggleExpandBtn: PropTypes.func,
    handleToggleCatalog: PropTypes.func,
    id: PropTypes.number,
    expanded: PropTypes.objectOf(PropTypes.bool),
    expandable: PropTypes.objectOf(PropTypes.bool),
    superior: PropTypes.number,
    isEditor: PropTypes.bool
  }
  static defaultProps = {
    url: '/123',
    isSelected: false,
    toolMethods: {},
    title: 'aaaaaaaaaaaa爱仕达所大所多撒多爱仕达所大所大所多aaaaaaaaaaa',
    depth: 1
  }
  constructor(props) {
    super(props);
    this.onExpandClick = this.onExpandClick.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
  }

  handleLinkClick(id) {
    if (this.props.isEditor) {
    }
    // todo, the selected action
    // dispatch(id);
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
      selected, url, title, depth, expanded, id, expandable, superior, toolMethods, isEditor,
      handleToggleCatalog
    } = this.props;
    console.log(this.props);
    if (isEditor) {
      return (
        <div className="catalog-item" style={{ paddingLeft: `${depth * 12}px` }}>
          <div className="catalog-item-link">
            <NavLink onClick={e => this.handleLinkClick(id, e)} style={superior !== 0 ? { color: '#999' } : { color: '#000' }} activeStyle={{ color: '#007bff' }} to={url}>
              {title}
            </NavLink>
          </div>
          <div className="catalog-item-tool"><ItemTools toolMethod={toolMethods} /></div>
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
        <div className="catalog-item-link" onMouseDown={() => handleToggleCatalog(false)} role="presentation">
          <NavLink style={superior !== 0 ? { color: '#999' } : { color: '#000' }} activeStyle={{ color: '#007bff' }} to={url}>
            {title}
          </NavLink>
        </div>
        <div className="catalog-item-tool"><ItemTools toolMethod={toolMethods} /></div>
      </div>
    );
  }
}

export default CatalogItem;
