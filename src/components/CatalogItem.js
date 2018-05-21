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
        <IconButton>
          <MoreVertIcon style={{ transition: 'all 0s' }} />
        </IconButton>
      }
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
    toolMethod: PropTypes.shape({
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
    superior: PropTypes.number
  }
  static defaultProps = {
    url: '/123',
    isSelected: false,
    toolMethod: {},
    title: 'aaaaaaaaaaaa爱仕达所大所多撒多爱仕达所大所大所多aaaaaaaaaaa',
    depth: 1
  }
  constructor(props) {
    super(props);
    this.onExpandClick = this.onExpandClick.bind(this);
  }
  onExpandClick() {
    const { toggleExpandBtn, id } = this.props;
    toggleExpandBtn(id);
  }
  render() {
    const {
      selected, url, title, depth, expanded, id, expandable, superior, toolMethod,
      handleToggleCatalog
    } = this.props;
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
        <div className="catalog-item-link" onMouseUp={() => handleToggleCatalog(false)} role="presentation">
          <NavLink style={superior !== 0 ? { color: '#999' } : { color: '#000' }} activeStyle={{ color: '#007bff' }} to={url}>
            {title}
          </NavLink>
        </div>
        <div className="catalog-item-tool"><ItemTools toolMethod={toolMethod} /></div>
      </div>
    );
  }
}

export default CatalogItem;
