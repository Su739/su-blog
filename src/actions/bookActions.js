import { CALL_API, Schemas } from '../middleware/api';

export const BOOK_REQUEST = 'BOOK_REQUEST';
export const BOOK_SUCCESS = 'BOOK_SUCCESS';
export const BOOK_FAILURE = 'BOOK_FAILURE';
export const ADD_BOOK_ENTITY = 'ADD_ARTICLE_ENTITY';
export const UPDATE_BOOK_ENTITY = 'UPDATE_ARTICLE_ENTITY';
export const DELETE_BOOK_ENTITY = 'DELETE-BOOK_ENTITY';

const addBookEntity = (writername, book) => ({
  type: ADD_BOOK_ENTITY,
  book,
  writername
});

const updateBookEntity = book => ({
  type: UPDATE_BOOK_ENTITY,
  book
});

const deleteBookEntity = id => ({
  type: DELETE_BOOK_ENTITY,
  id
});

const fetchBook = bookid => ({
  bookid,
  [CALL_API]: {
    types: [BOOK_REQUEST, BOOK_SUCCESS, BOOK_FAILURE],
    endpoint: `books/${bookid}`,
    apischema: Schemas.BOOK,
    result: 'book'
  }
});

// Fetches a single user from API unless it is cached.
// Relies on Redux Thunk middleware.
const loadBook = (bookid, refresh) => (dispatch, getState) => {
  const book = getState().entities.books[bookid];
  // articles可以确保book已经请求，不然可能只有book没有articles
  if (book && book.articles && !refresh) {
    return null;
  }
  return dispatch(fetchBook(bookid));
};

export default {
  loadBook, addBookEntity, updateBookEntity, deleteBookEntity
};
