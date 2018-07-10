export const ADD_DELETING_ARTICLES = 'ADD_DELETING_ARTICLES';
export const ADD_DELETING_BOOKS = 'ADD_DELETING_BOOKS';
export const REMOVE_DELETING_ARTICLE = 'REMOVE_DELETING_ARTICLE';
export const REMOVE_DELETING_BOOK = 'REMOVE_DELETING_BOOK';
export const DESTROY_DELETING_ARTICLES = 'DESTROY_DELETING_ARTICLES';
export const DESTROY_DELETING_BOOKS = 'DESTROY_DELETING_BOOKS';

const addDeletingArticles = (ids) => {
  if (Array.isArray(ids)) {
    return {
      type: ADD_DELETING_ARTICLES,
      ids
    };
  }
  return {
    type: ADD_DELETING_ARTICLES,
    ids: [ids]
  };
};

const addDeletingBooks = (ids) => {
  if (Array.isArray(ids)) {
    return {
      type: ADD_DELETING_BOOKS,
      ids
    };
  }
  return {
    type: ADD_DELETING_BOOKS,
    ids: [ids]
  };
};

const removeDeletingArticle = id => ({
  type: REMOVE_DELETING_ARTICLE,
  id
});

const removeDeletingBook = id => ({
  type: REMOVE_DELETING_BOOK,
  id
});

const destroyDeletingArticles = () => ({
  type: DESTROY_DELETING_ARTICLES
});

const destroyDeletingBooks = () => ({
  type: DESTROY_DELETING_BOOKS
});

export default {
  addDeletingArticles,
  addDeletingBooks,
  removeDeletingArticle,
  removeDeletingBook,
  destroyDeletingArticles,
  destroyDeletingBooks
};
