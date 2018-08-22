'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _app = require('./app');

var _midi = require('./midi');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
const noteLength = getParameterByName('noteLength');
const grid = getParameterByName('grid');

// console.log(props);
const queryGrid = grid ? JSON.parse(grid) : undefined;
// console.log(queryGrid);
const queryNoteLength = noteLength ? parseInt(noteLength, 10) : undefined;
// console.log(queryNoteLength);
const data = '{"noteLength":200,"grid":{"size":8,"arrows":[{"x":0,"y":0,"vector":0},{"x":1,"y":1,"vector":0},{"x":2,"y":2,"vector":0},{"x":3,"y":3,"vector":0},{"x":4,"y":4,"vector":0},{"x":5,"y":5,"vector":0},{"x":6,"y":6,"vector":0},{"x":7,"y":7,"vector":0},{"x":0,"y":7,"vector":0},{"x":1,"y":6,"vector":0},{"x":2,"y":5,"vector":0},{"x":3,"y":4,"vector":0},{"x":4,"y":3,"vector":0},{"x":5,"y":2,"vector":0},{"x":6,"y":1,"vector":0},{"x":7,"y":0,"vector":0},{"x":0,"y":0,"vector":0},{"x":1,"y":1,"vector":0},{"x":2,"y":2,"vector":0},{"x":3,"y":3,"vector":0},{"x":4,"y":4,"vector":0},{"x":5,"y":5,"vector":0},{"x":6,"y":6,"vector":0},{"x":7,"y":7,"vector":0},{"x":0,"y":7,"vector":0},{"x":1,"y":6,"vector":0},{"x":2,"y":5,"vector":0},{"x":3,"y":4,"vector":0},{"x":4,"y":3,"vector":0},{"x":5,"y":2,"vector":0},{"x":6,"y":1,"vector":0},{"x":7,"y":0,"vector":0}],"muted":true,}}';
const encoded = getParameterByName('data');
let parsedGrid = {};
if (encoded) {
    console.log(encoded);
    const decoded = window.atob(encoded);
    console.log(decoded);
    parsedGrid = JSON.parse(decoded);
}
// eslint-disable-next-line no-undef
particlesJS.load('particles-js', '../src/assets/particles.json', function () {});
// eslint-disable-next-line no-undef
_reactDom2.default.render(_react2.default.createElement(_app.Application, { noteLength: parsedGrid.noteLength, grid: parsedGrid.grid }), document.getElementById('root'));
(0, _midi.midiUtils)();

// Feature detects Navigation Timing API support.
if (window.performance) {
    // Gets the number of milliseconds since page load
    // (and rounds the result since the value must be an integer).
    var timeSincePageLoad = Math.round(performance.now());

    // Sends the timing hit to Google Analytics.
    ga('send', 'timing', 'JS Dependencies', 'load', timeSincePageLoad);
}