'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SymmetryButton = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _icons = require('./icons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SymmetryButton = exports.SymmetryButton = function ({ onClick, isActive, className }) {
    return _react2.default.createElement(
        'button',
        { className: "EditButton isEnabled" + (isActive ? " ActiveControl" : ""), onClick: onClick },
        _react2.default.createElement(_icons.SymmetryIcon, { className: className })
    );
};