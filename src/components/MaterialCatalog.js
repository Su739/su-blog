import React from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import NewArticleButton from './NewArticleButton';
import CatalogItem from './CatalogItem';
import sortCatalog from './utils/sortCatalog';
import './Catalog.css';

const editorStyle = (isEditor, width) => {
  if (isEditor) {
    if (width > 768) {
      return {
        height: 'calc(100% - 64px)',
        top: '64px',
        left: '0',
        overflowX: 'hidden',
        transform: 'none',
        maxWidth: '300px',
        boxShadow: '3px 0px 8px rgba(0, 0, 0, 0.16), inset 0px 2px 0px rgba(0, 0, 0, 0.12)',
        backgroundColor: '#fff'
      };
    }
  }

  if (width > 768) {
    return {
      height: 'calc(100% - 64px)',
      top: '64px',
      left: 'none',
      overflowX: 'hidden',
      transform: 'none',
      maxWidth: '300px',
      boxShadow: '3px 0px 8px rgba(0, 0, 0, 0.16), inset 0px 2px 0px rgba(0, 0, 0, 0.12)',
      backgroundColor: '#fff'
    };
  }

  return {
    overflowX: 'hidden',
    maxWidth: '350px',
    left: 'none',
    backgroundColor: '#fff'
  };
};

const MaterialCatalog = (props) => {
  const {
    isEditor, isFetching,
    articles, url, bookid, history,
    screenWidth, displayCatalog, expanded, hasNewArticle,
    toolMethods, handleToggleCatalog, toggleExpandBtn, toggleBlockedModal, addBlockedArticle,
    addArticle
  } = props;
  let initialPage = null;
  const catalogList = [];
  const bySuperior = {}; // 按照superior分类，值为该superior的文章数
  // 对文章进行排序，生成目录
  if (articles && articles.length > 0) {
    if (isEditor) {
      const sorted = sortCatalog(articles);
      sorted.forEach(r =>
        r.forEach((item) => {
          if (bySuperior[item.superior]) {
            bySuperior[item.superior] += 1;
          } else {
            bySuperior[item.superior] = 1;
          }
        }));
      sorted.forEach(r =>
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
              bySuperior={bySuperior}
              toggleBlockedModal={toggleBlockedModal}
              hasNewArticle={hasNewArticle}
              addBlockedArticle={addBlockedArticle}
              addArticle={addArticle}
              bookid={bookid}
              history={history}
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
  }
  return (
    <Drawer
      docked={screenWidth > 768}
      width={screenWidth > 768 ? '18%' : '60%'}
      open={screenWidth > 768 || displayCatalog}
      onRequestChange={() => {
        if (screenWidth < 768) {
          handleToggleCatalog(false);
        }
      }}
      containerStyle={editorStyle(isEditor, screenWidth)}
    >
      {isFetching && <div>loading...</div>}
      {initialPage}
      <div className="catalog-list">
        {catalogList}
      </div>
      {isEditor &&
        <NewArticleButton onClick={() => {
            const order = bySuperior[0] ? bySuperior[0] + 1 : 1;
            if (hasNewArticle) { // 这个不需要转到-1， 本身他就在-1
              addBlockedArticle(-1, 0, order, 0, '未命名', '\n\n\n\n\n\n\n\n', bookid, true);
              toggleBlockedModal(true);
            } else {
              toolMethods.addArticle(-1, 0, order, 0, '未命名', '\n\n\n\n\n\n\n\n', bookid, true);
              history.push(`${url}/-1`); // 转到 articleid为 -1
            }
          }}
        />
      }
    </Drawer>
  );
};
MaterialCatalog.propTypes = {
  history: PropTypes.objectOf(PropTypes.any),
  expanded: PropTypes.objectOf(PropTypes.bool),
  toggleExpandBtn: PropTypes.func,
  screenWidth: PropTypes.number,
  articles: PropTypes.arrayOf(PropTypes.object),
  url: PropTypes.string,
  isEditor: PropTypes.bool,
  toolMethods: PropTypes.objectOf(PropTypes.func),
  displayCatalog: PropTypes.bool,
  handleToggleCatalog: PropTypes.func,
  isFetching: PropTypes.bool,
  hasNewArticle: PropTypes.bool,
  toggleBlockedModal: PropTypes.func,
  addArticle: PropTypes.func,
  addBlockedArticle: PropTypes.func,
  bookid: PropTypes.number
};

export default MaterialCatalog;
