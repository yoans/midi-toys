'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ArrowButton = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _icons = require('./icons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ArrowButton = exports.ArrowButton = function ({ onClick, direction, number }) {
    return _react2.default.createElement(
        'button',
        { className: "ArrowButton isEnabled", onClick: onClick },
        _react2.default.createElement(
            'div',
            { className: "number-overlayee" },
            _react2.default.createElement(_icons.ArrowIcon, { direction: direction }),
            _react2.default.createElement('div', { className: 'number-overlay' })
        )
    );
};