'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _app = require('./app');

var _midi = require('./midi');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line no-undef
particlesJS.load('particles-js', '../src/assets/particles.json', function () {});
// eslint-disable-next-line no-undef
_reactDom2.default.render(_react2.default.createElement(_app.Application, null), document.getElementById('root'));
(0, _midi.midiUtils)();