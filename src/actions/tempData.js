export const ADD_NEW_ARTICLE = 'NEW_ARTICLE';
export const DESTROY_NEW_ARTICLE = 'DESTROY_NEW_ARTICLE';
export const ADD_BLOCKED_ARTICLE = 'ADD_BLOCKED_ARTICLE';
export const DESTROY_BLOCKED_ARTICLE = 'DESTROY_BLOCKED_ARTICLE';
export const CLEAN_TEMP_DATA = 'CLEAN_TEMP_DATA';

function addNewArticle(id = -1, depth, order, superior, title = '未命名', content = '') {
  return {
    type: ADD_NEW_ARTICLE,
    newArticle: {
      id,
      depth,
      order,
      superior,
      title,
      content
    }
  };
}

function addBlockedArticle(id = -1, depth, order, superior, title = '未命名', content = '') {
  return {
    type: ADD_NEW_ARTICLE,
    blockedArticle: {
      id,
      depth,
      order,
      superior,
      title,
      content
    }
  };
}

function destroyNewArticle() {
  return { type: DESTROY_NEW_ARTICLE };
}

function destroyBlockedArticle() {
  return { type: DESTROY_BLOCKED_ARTICLE };
}

function cleanTempData() {
  return { type: CLEAN_TEMP_DATA };
}

export default {
  addNewArticle,
  addBlockedArticle,
  destroyNewArticle,
  destroyBlockedArticle,
  cleanTempData
};
