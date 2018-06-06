export const ADD_ARTICLE = 'ADD_ARTICLE';
export const ADD_BLOCKED_ARTICLE = 'ADD_BLOCKED_ARTICLE';
export const UPDATE_ARTICLE = 'UPDATE_ARTICLE';
export const REMOVE_ARTICLE = 'REMOVE_ARTICLE';
export const REMOVE_BLOCKED_ARTICLE = 'REMOVE_BLOCKED_ARTICLE';
export const EDIT_ARTICLE = 'UPDATE_ARTICLE';
export const CANCEL_ARTICLE_CHANGE = 'CANCEL_ARTICLE_CHANGE';
export const INITIAL_EDITING_DATA = 'INITIAL_EDITING_DATA';
export const DESTROY_EDITING_DATA = 'DESTROY_EDITING_DATA';

function addArticle(id = -1, depth, order, superior, title = '未命名', content = '', parent, ispublic) {
  return {
    type: ADD_ARTICLE,
    newArticle: {
      id,
      depth,
      order,
      superior,
      title,
      content,
      parent,
      public: ispublic
    },
    hasNewArticle: id === -1
  };
}

function addBlockedArticle(id = -1, depth, order, superior, title = '未命名', content = '', parent, ispublic) {
  return {
    type: ADD_BLOCKED_ARTICLE,
    blockedArticle: {
      id,
      depth,
      order,
      superior,
      title,
      content,
      parent,
      public: ispublic
    }
  };
}

function removeBlockedArticle() {
  return { type: REMOVE_BLOCKED_ARTICLE };
}

function updateArticle(article) {
  if (!article.id) throw new Error('id must be passed in updateArticle action');
  return {
    type: UPDATE_ARTICLE,
    newArticle: {
      ...article
    }
  };
}

function removeArticle(id) {
  return { type: REMOVE_ARTICLE, id, hasNewArticle: id === -1 };
}

function cancelArticleChange(article) {
  return { type: CANCEL_ARTICLE_CHANGE, article };
}

function initialEditingData(articles, books) {
  return {
    type: INITIAL_EDITING_DATA,
    booksById: books,
    articlesById: articles
  };
}

function destroyDeitingData() {
  return { type: DESTROY_EDITING_DATA };
}

export default {
  addArticle,
  addBlockedArticle,
  removeArticle,
  removeBlockedArticle,
  initialEditingData,
  destroyDeitingData,
  cancelArticleChange,
  updateArticle
};
