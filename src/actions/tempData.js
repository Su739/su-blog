export const NEW_ARTICLE = 'NEW_ARTICLE';

function addNewArticle(id = -1, depth, order, superior, title = '未命名', content = '') {
  return {
    type: NEW_ARTICLE,
    id,
    depth,
    superior,
    title,
    content
  };
}

export default {
  addNewArticle
};
