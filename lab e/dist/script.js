/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*******************!*\
  !*** ./script.ts ***!
  \*******************/


function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var styles = {
  style1: 'dist/page1.css',
  style2: 'dist/page2.css',
  style3: 'dist/page3.css'
};
var currentStyle = 'style1';
var setStyle = function setStyle(styleKey) {
  currentStyle = styleKey;
  var linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.href = styles[currentStyle];
  linkElement.id = 'styleSheet';
  var existingLink = document.getElementById('styleSheet');
  if (existingLink) {
    existingLink.remove();
  }
  document.head.appendChild(linkElement);
  console.log("Styl zmieniony na: ".concat(styles[currentStyle]));
};
var createStyleButtons = function createStyleButtons() {
  var buttonContainer = document.getElementById('styleButtons');
  buttonContainer.innerHTML = '';
  var _loop = function _loop() {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
      styleKey = _Object$entries$_i[0],
      stylePath = _Object$entries$_i[1];
    var button = document.createElement('button');
    button.textContent = "U\u017Cyj ".concat(styleKey);
    button.classList.add('style-button');
    button.onclick = function () {
      return setStyle(styleKey);
    };
    buttonContainer.appendChild(button);
  };
  for (var _i = 0, _Object$entries = Object.entries(styles); _i < _Object$entries.length; _i++) {
    _loop();
  }
};
document.addEventListener('DOMContentLoaded', function () {
  createStyleButtons();
});
/******/ })()
;