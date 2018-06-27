'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EraseButton = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _icons = require('./icons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EraseButton = exports.EraseButton = function ({ onClick, isErasing }) {
    return _react2.default.createElement(
        'button',
        { className: "EditButton isEnabled" + (isErasing ? " ActiveControl" : ""), onClick: onClick },
        _react2.default.createElement(_icons.EraseIcon, null)
    );
};