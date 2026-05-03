import defaults from 'licia/defaults';
import themes from './themes';

let styleList = [];
let scale = 1;

let curTheme = themes.Dark;

const exports = function (css, container) {
  css = css.toString();

  for (let i = 0, len = styleList.length; i < len; i++) {
    if (styleList[i].css === css) return;
  }

  container = container || exports.container || document.head;
  const el = document.createElement('style');
  el.type = 'text/css';
  const nonce = document.querySelector('style[nonce]')?.nonce;
  if (nonce && nonce.length > 0) {
    el.nonce = nonce;
  }
  
  container.appendChild(el);

  resetStyle(css, el);
  const style = { css, el, container };
  styleList.push(style);

  return style;
}

exports.setScale = function (s) {
  scale = s;

  for (let i = 0, len = styleList.length; i < len; i++) {
    el.innerText = 
      styleList[i].css.replace(/(\d+)px/g, (_, $1) => +$1 * scale + 'px');
  }
}

exports.setTheme = function (theme) {
  if (typeof theme === "string") {
    curTheme = themes[theme] || themes.Dark;
  } else {
    curTheme = defaults(theme, themes.Dark);
  }

  for (let i = 0, len = styleList.length; i < len; i++) {
    const style = styleList[i];
    resetStyle(style.css, style.el);
  }
}

exports.getCurTheme = () => curTheme;

exports.getThemes = () => themes;

exports.clear = function () {
  for (let i = 0, len = styleList.length; i < len; i++) {
    const style = styleList[i];
    style.container.removeChild(style.el);
  }
  styleList = [];
}

exports.remove = function (style) {
  styleList = styleList.filter((s) => s !== style);

  style.container.removeChild(style.el);
}

const regUpperCase = /([A-Z])/g;
function resetStyle(css, el) {
  css = css
    .replaceAll(/(\d+)px/g, (_, $1) => +$1 * scale + 'px')
    .replaceAll('_', 'eruda-');
  for (const key of Object.keys(themes.Light)) {
    const kebabCase = key.replaceAll(regUpperCase, '-$1').toLowerCase();
    css = css.replaceAll(`var(--${kebabCase})`, curTheme[key]);
  }
  el.innerText = css;
}

export default exports;
