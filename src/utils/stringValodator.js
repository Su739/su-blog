// 一个中文算3个字母
export function validLength(str, min, max) {
  if (min === undefined && max === undefined) {
    throw new Error('function verifyLength: min and max is required');
  }
  if (min < 0) {
    min = 0; // eslint-disable-line no-param-reassign
  }
  if (max === undefined) {
    max = Infinity; // eslint-disable-line no-param-reassign
  }
  const chinesePattern = /[\u4e00-\u9fa5]{1}/g;
  const chiLength = str.match(chinesePattern).length;
  const result = str.length + 2 * chiLength;
  return result >= min && result <= max;
}

export function isEmpty(str) {
  return str.length === 0;
}

const validator = {
  validLength,
  isEmpty,
};

export default validator;
