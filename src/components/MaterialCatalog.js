import React from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import CatalogItem from './CatalogItem';
import sortCatalog from './utils/sortCatalog';
import './Catalog.css';

const MaterialCatalog = (props) => {
  const {
    isEditor, isFetching,
    articles, url,
    screenWidth, displayCatalog, expanded,
    toolMethods, handleToggleCatalog, toggleExpandBtn
  } = props;
  let initialPage = null;
  const catalogList = [];
  console.log(articles);
  // 对文章进行排序，生成目录
  if (articles && articles.length > 0) {
    if (isEditor) {
      sortCatalog(articles).forEach(r =>
        r.forEach((item) => {
          const {
            id, title, depth, superior
          } = item;
          if (superior === -1) {
            initialPage = (<CatalogItem
              key={id}
              title={title}
              depth={depth}
              url={`${url}/${id}`}
              id={id}
              superior={superior}
              toolMethods={toolMethods}
              isEditor={isEditor}
            />);
          } else {
            catalogList.push(<CatalogItem
              key={id}
              title={title}
              depth={depth}
              url={`${url}/${id}`}
              id={id}
              superior={superior}
              toolMethods={toolMethods}
              isEditor={isEditor}
            />);
          }
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
              id, title, depth, superior
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
          } else if (item.superior === -1) {
            const {
              id, title, depth, superior
            } = item;
            initialPage = (<CatalogItem
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
    console.log(catalogList);
  }
  return (
    <Drawer
      docked={screenWidth > 768}
      width={screenWidth > 768 ? '20%' : '60%'}
      open={screenWidth > 768 || displayCatalog}
      onRequestChange={() => handleToggleCatalog(false)}
      containerStyle={screenWidth > 768
        ? { height: 'calc(100% - 64px)', top: '64px', overflowX: 'hidden' }
        : { overflowX: 'hidden' }}
    >
      <div className="catalog-list">
        {initialPage}
        {isFetching
        ?
          <div>loading...</div>
        :
        catalogList}
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
  isFetching: PropTypes.bool
};

export default MaterialCatalog;
