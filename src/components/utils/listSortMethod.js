/**
 * 通过含有时间信息的键比较大小
 * @param {Object} obj1
 * @param {Object} obj2
 * @param {string} key
 * @param {string} method
 */
function compareByDate(obj1, obj2, key, method) {
  return function compare(b1, b2) {
    switch (method) {
      case 'time-asc':
        if (b1.postDate < b2.postDate) {
          return -1;
        } else if (b1.postDate > b2.postDate) {
          return 1;
        }
        return 0;
      case 'time-desc':
        if (b1.postDate < b2.postDate) {
          return 1;
        } else if (b1.postDate > b2.postDate) {
          return -1;
        }
        return 0;

      default:
        if (b1.postDate < b2.postDate) {
          return 1;
        } else if (b1.postDate > b2.postDate) {
          return -1;
        }
        return 0;
    }
  };
}
