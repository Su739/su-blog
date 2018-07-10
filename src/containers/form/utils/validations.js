export const required = value => (value ? undefined : 'Required');
const maxLength = max => value =>
  (value && value.length > max ? `Must be ${max} characters or less` : undefined);
export const minLength = min => value =>
  (value && value.length < min ? `Must be ${min} characters or more` : undefined);
const number = value =>
  (value && isNaN(Number(value)) ? 'Must be a number' : undefined);
const minValue = min => value =>
  (value && value < min ? `Must be at least ${min}` : undefined);
const minValue13 = minValue(13);
const email = value =>
  (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined);
const tooYoung = value =>
  (value && value < 13
    ? 'You do not meet the minimum age requirement!'
    : undefined);
const aol = value =>
  (value && /.+@aol\.com/.test(value)
    ? 'Really? You still use AOL for your email?'
    : undefined);
const alphaNumeric = value =>
  (value && /[^a-zA-Z0-9 ]/i.test(value)
    ? 'Only alphanumeric characters'
    : undefined);

const phoneNumber = value =>
  (value && !/^(0|[1-9][0-9]{9})$/i.test(value)
    ? 'Invalid phone number, must be 10 digits'
    : undefined);

export const validUserName = (options = { minLen: 2, maxLen: 18, pattern: /^[a-zA-Z0-9_]+$/ }) => (username) => {
  const { minLen, maxLen, pattern } = options;
  if (!email(username)) {
    return undefined;
  }
  if (!username || maxLength(maxLen)(username) ||
  minLength(minLen)(username) || !pattern.test(username)) {
    return '用户名应该由2-18个字母、数字或者下划线组成';
  }
  return undefined;
};

export const validPassword = (options = { minLen: 8, maxLen: 20 }) => (password) => {
  const { minLen = 8, maxLen = 20 } = options;
  if (!password || password.length > maxLen || password.length < minLen) {
    return '密码在8-20个字符之间';
  }
  return undefined;
};

export default {
  validUserName,
  validPassword,
  required
};

