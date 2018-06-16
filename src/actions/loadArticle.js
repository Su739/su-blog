import { CALL_API, Schemas } from '../middleware/api';

export const ARTICLE_REQUEST = 'ARTICLE_REQUEST';
export const ARTICLE_SUCCESS = 'ARTICLE_SUCCESS';
export const ARTICLE_FAILURE = 'ARTICLE_FAILURE';

const fetchArticle = id => ({
  [CALL_API]: {
    types: [ARTICLE_REQUEST, ARTICLE_SUCCESS, ARTICLE_FAILURE],
    endpoint: `a/${id}`,
    apischema: Schemas.ARTICLE,
    result: 'article'
  }
});

// Fetches a single user from API unless it is cached and not willing to refresh it.
// Relies on Redux Thunk middleware.
const loadArticle = (id, refresh) => (dispatch, getState) => {
  const article = getState().entities.articles[id];
  if (article && article.content && !refresh) { // 第二个条件是因为加载目录时不会获取文章内容, 第三个条件是没要求强制刷新
    return null;
  }
  return dispatch(fetchArticle(id));
};

export default loadArticle;
