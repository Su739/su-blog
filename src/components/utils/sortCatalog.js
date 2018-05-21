const data = { // eslint-disable-line
  10: {
    uid: 10, pa: 9, depth: 1, data: '1', order: 1,
  },
  9: {
    uid: 9, pa: 0, depth: 0, data: '1', order: 2,
  },
  8: {
    uid: 8, pa: 1, depth: 1, data: '1', order: 1,
  },
  4: {
    uid: 4, pa: 3, depth: 3, data: '1', order: 1,
  },
  1: {
    uid: 1, pa: 0, depth: 0, data: '1', order: 1,
  },

  2: {
    uid: 2, pa: 1, depth: 1, data: '1', order: 2,
  },
  3: {
    uid: 3, pa: 8, depth: 2, data: '1', order: 1,
  },
};

/** 将上面这种格式的数据按照superior分类
 *
 * @param {Object} obj 输入源数据
 * @param {string?} superior superior字段名
 * @return {Object} 按照superior分类的结果
 */
export function itemsByParent(obj, superior = 'superior') {
  if (!obj || typeof obj !== 'object') {
    throw new Error('输入一个object类型数据第一个参数');
  }
  const keys = Object.keys(obj);
  const resource = keys.map(k => obj[k]);// 源数据的数组格式
  const entities = {}; // 按照superior分类的集合,也就是他的所有键值，对应含有子元素的文章的id

  // 把arrary(object) 转换为 key-value集合，其中key是superior字段，value是数组中的元素组成的数组
  resource.forEach((r) => {
    if (entities[r[superior]]) {
      entities[r[superior]].push(r);
    } else {
      entities[r[superior]] = [r];
    }
  });

  // 对集合中每一项对应的数组按照order字段排序
  Object.keys(entities).forEach((k) => {
    entities[k].sort((o1, o2) => parseInt(o1.order, 10) - parseInt(o2.order, 10));
  });

  return entities;
}

/** 将上面这种格式的数据按照目录格式排序
 *
 * @param {Object} obj 输入源数据
 * @param {string?} id id字段名
 * @param {string?} superior superior字段名
 */
function sortCatalog(obj, id = 'id', superior = 'superior') {
  if (!obj || typeof obj !== 'object') {
    throw new Error('输入一个object类型数据第一个参数');
  }
  const keys = Object.keys(obj);
  const resource = keys.map(k => obj[k]);// 源数据的数组格式
  // const resource2 = []; // 处理过的数组
  const byDepth = {}; // 按照depth分类的集合
  const arrDepth = []; // depth序号(确定顺序desc)数组
  const compare = (v1, v2) => parseInt(v2, 10) - parseInt(v1, 10);

  /*
  // 把arrary(object) 转换为 key-value集合，其中key是superior字段，value是数组中的元素组成的数组
  // 哈哈，而没想到这段用的'.'，然后superior是undefined，第一次在else加入后全是undefined，
  // 然而恰巧好用的原因是后面的只要order排好就能用。。先进去的都是order === 1
  resource.forEach((r) => {
    if (entities[r.superior]) {
      entities[r.superior].push(r);
    } else {
      entities[r.superior] = [r];
    }
  });

  // 对集合中每一项对应的数组按照order字段排序,并将排序后的数组元素spread，加入到resource2
  Object.keys(entities).forEach((k) => {
    entities[k].sort((o1, o2) => parseInt(o1.order, 10) - parseInt(o2.order, 10));
    resource2 = [...resource2, ...entities[k]];
  });
  */

  // 其实只要按order排序就可以，不需要上面那么分一下。。。
  resource.sort((o1, o2) => parseInt(o1.order, 10) - parseInt(o2.order, 10));

  /** byDepth结果是这样子的,这种方法应该占内存，没有删除不再使用的depth较深的map，而且每层都是叠加的。。。
   * {
   *   [depth]: map([id]: [{data}])
   * }
   */
  resource.forEach((r) => {
    const { depth } = r;

    // 判断字段是否存在
    if (byDepth[depth]) {
      if (byDepth[depth].has(r[id])) {
        byDepth[depth].get(r[id]).push(r); // 按道理这句没用，访问不到，因为id没重复
      } else {
        byDepth[depth].set(r[id], [r]); // 这句决定顺序
      }
    } else {
      arrDepth.push(r.depth); // 生成depth(无序)数组
      byDepth[depth] = new Map([[r[id], [r]]]);// map初始化，就是有这么多的[]
    }
  });

  // 倒序排列，由深到浅,d是深度(数字字符串),o是一条源数据(Object)
  arrDepth.sort(compare);
  arrDepth.forEach((d) => { // 按照depth排序数组迭代
    if (d > 0) {
      byDepth[d].forEach((value, key) => { // 迭代map内的所有值，map的key对应源数据的id值，value是由源数据组成的数组
        if (!byDepth[d - 1]) {
          throw Error('读取到的数据结构有问题，所有项必须有depth0根节点');
        }
        // 增加节点标记
        if (!byDepth[d - 1].get(byDepth[d].get(key)[0][superior])[0].hasChildren) {
          byDepth[d - 1].get(byDepth[d].get(key)[0][superior])[0].hasChildren = true;
        }
        // 迭代value数组，将源数据push到上一层的父元素后面
        value.forEach(v => byDepth[d - 1].get(byDepth[d].get(key)[0][superior]).push(v));
      });
    }
  });

  return byDepth['0'];// 返回值是一个map，包含depth === 0的所有键(id)，value值由他本身与后代组成
  /**
   * 返回值也许这么用
   * const catalogList = []
   * result.forEach((r) => r.forEach(item => catalogList.push(item)))
  */
}

export default sortCatalog;
