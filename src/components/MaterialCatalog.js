import React from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import CatalogItem from './CatalogItem';
import sortCatalog from './utils/sortCatalog';
import './Catalog.css';

const MaterialCatalog = (props) => {
  const {
    isEditor,
    articles, url,
    screenWidth, displayCatalog, expanded,
    toolMethods, handleToggleCatalog, toggleExpandBtn,
  } = props;
  const catalogList = [];
  // 对文章进行排序，生成目录
  if (articles && articles.length > 0) {
    if (isEditor) {
      sortCatalog(articles).forEach(r =>
        r.forEach((item) => {
          const { id, title, depth } = item;
          catalogList.push(<CatalogItem
            key={id}
            title={title}
            depth={depth}
            url={`${url}/a/${id}`}
            id={id}
            toolMethods={toolMethods}
            isEditor={isEditor}
          />);
        }));
    } else {
      const expandable = {};
      articles.forEach((r) => {
        if (!expandable[r.superior]) {
          expandable[r.superior] = true;
        }
      });
      sortCatalog(articles).forEach(r =>
        r.forEach((item) => {
          if (item.superior === 0 || expanded[item.superior]) {
            const {
              id, title, depth, superior,
            } = item;
            catalogList.push(<CatalogItem
              key={id}
              title={title}
              depth={depth}
              url={`${url}/a/${id}`}
              id={id}
              superior={superior}
              expandable={expandable}
              toggleExpandBtn={toggleExpandBtn}
              isEditor={isEditor}
              expanded={expanded}
              handleToggleCatalog={handleToggleCatalog}
            />);
          }
        }));
    }
  }
  return (
    <Drawer
      docked={screenWidth > 768}
      width={300}
      open={screenWidth > 768 || displayCatalog}
      onRequestChange={() => handleToggleCatalog(false)}
      containerStyle={screenWidth > 768
        ? { height: 'calc(100% - 64px)', top: '64px', overflowX: 'hidden' }
        : { overflowX: 'hidden' }}
    >
      <div className="catalog-list">
        {catalogList}
      </div>
    </Drawer>
  );
};
MaterialCatalog.propTypes = {
  expanded: PropTypes.objectOf(PropTypes.bool),
  toggleExpandBtn: PropTypes.func,
  screenWidth: PropTypes.number,
  articles: PropTypes.arrayOf(PropTypes.object),
  url: PropTypes.string,
  isEditor: PropTypes.bool,
  toolMethods: PropTypes.objectOf(PropTypes.func),
  displayCatalog: PropTypes.bool,
  handleToggleCatalog: PropTypes.func,
};

export default MaterialCatalog;
