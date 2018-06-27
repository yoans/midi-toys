'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EditButton = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _icons = require('./icons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EditButton = exports.EditButton = function ({ onClick, isEditing, className }) {
    return _react2.default.createElement(
        'button',
        { className: "EditButton isEnabled", onClick: onClick },
        _react2.default.createElement(_icons.EditIcon, { className: className })
    );
};
// + (isEditing ? " ActiveControl":"")