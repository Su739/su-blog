const cookieParser = {
  /**
   * @param {string} name Key Name in cookie
   * @return key value
   */
  getValue(name) {
    const cookieName = `${encodeURIComponent(name)}=`;
    /* eslint-disable no-undef */
    const cookieStart = document.cookie.indexOf(cookieName);
    let cookieValue = null;

    if (cookieStart > -1) {
      let cookieEnd = document.cookie.indexOf(';', cookieStart);
      if (cookieEnd === -1) {
        cookieEnd = document.cookie.length;
      }
      cookieValue =
        decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
    }
    return cookieValue;
  },
  setValue(name, value, expires, path, domain, secure) {
    let cookieText = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (expires instanceof Date) {
      cookieText += `; expires=${expires.toGMTString()}`;
    }

    if (path) {
      cookieText += `; path=${path}`;
    }

    if (domain) {
      cookieText += `; domain=${domain}`;
    }

    if (secure) {
      cookieText += '; secure';
    }
    document.cookie = cookieText;
  }
};

export default cookieParser;
