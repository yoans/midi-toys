'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TrashButton = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _icons = require('./icons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TrashButton = exports.TrashButton = function ({ onClick }) {
    return _react2.default.createElement(
        'button',
        { className: 'TrashButton isEnabled', onClick: onClick },
        _react2.default.createElement(_icons.TrashIcon, null)
    );
};