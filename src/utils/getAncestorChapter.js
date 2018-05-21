import { isArray } from 'lodash';

/** 获得文章标题与他的祖先章节标题
 * @param {string} t 文章标题
 * @param {aray} c 文章目录
 *
 * return [[(ancester)，t][]];
 */
export function getAncestorChapters(t, c) {
  let result = null;
  (function traverse(title, catalog, arr = []) {
    catalog.forEach((ch) => {
      if (arr.length <= 0 || arr[arr.length - 1] !== title) {
        if (ch.title === title) {
          arr.push(ch.title);
        } else if (ch.children && isArray(ch.children)) {
          arr.push(ch.title);
          traverse(title, ch.children, arr);
        }
      }
    });
    if (arr.length > 0 && arr[arr.length - 1] === title) {
      result = arr.slice();
    } else {
      arr.length = 0; // eslint-disable-line no-param-reassign
    }
  }(t, c));
  return result;
}

// 获得目录中的所有标题
export function getAllTitleInCatalog(catalog, result = []) {
  catalog.forEach((ch) => {
    if (ch.children && isArray(ch.children)) {
      result.push(ch.title);

      getAllTitleInCatalog(ch.children, result);
    } else {
      result.push(ch.title);
    }
  });
  return result;
}

// 获得目录中可折叠项并初始为true(折叠状态), 返回object{t1: true}
export function getCollapsibleInCatalog(catalog, result = {}) {
  catalog.forEach((ch) => {
    if (ch.children && isArray(ch.children)) {
      Object.assign(result, { [ch.title]: true });
      // result.push({ title: ch.title, hidden: true });
      getCollapsibleInCatalog(ch.children, result);
    }
  });
  return result;
}

const utils = {
  getAllTitleInCatalog,
  getAncestorChapters,
  getCollapsibleInCatalog,
};

export default utils;
