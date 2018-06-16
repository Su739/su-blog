import { CALL_API, Schemas } from '../middleware/api';

export const ARTICLE_LIST_REQUEST = 'ARTICLE_LIST_REQUEST';
export const ARTICLE_LIST_SUCCESS = 'ARTICLE_LIST_SUCCESS';
export const ARTICLE_LIST_FAILURE = 'ARTICLE_LIST_FAILURE';

const fetchArticleList = nextPageUrl => ({
  [CALL_API]: {
    types: [ARTICLE_LIST_REQUEST, ARTICLE_LIST_SUCCESS, ARTICLE_LIST_FAILURE],
    endpoint: nextPageUrl || 'v0/articles',
    apischema: Schemas.articleListSchema,
    result: 'articles'
  }
});

// Fetches a single user from API unless it is cached and not willing to refresh it.
// Relies on Redux Thunk middleware.
const loadArticleList = refresh => (dispatch, getState) => {
  const { nextPageUrl, pageCount } = getState().pagination.articleList;

  if (pageCount > 0 && !nextPageUrl && !refresh) { // 第二个条件是因为加载目录时不会获取文章内容, 第三个条件是没要求强制刷新
    return null;
  }
  return dispatch(fetchArticleList(nextPageUrl));
};

export default loadArticleList;
