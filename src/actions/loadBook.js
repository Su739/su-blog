import { CALL_API, Schemas } from '../middleware/api';

export const BOOK_REQUEST = 'BOOK_REQUEST';
export const BOOK_SUCCESS = 'BOOK_SUCCESS';
export const BOOK_FAILURE = 'BOOK_FAILURE';

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
const loadBook = bookid => (dispatch, getState) => {
  const book = getState().entities.books[bookid];
  // articles可以确保book已经请求，不然可能只有book没有articles
  if (book && book.articles) {
    return null;
  }
  return dispatch(fetchBook(bookid));
};

export default loadBook;
