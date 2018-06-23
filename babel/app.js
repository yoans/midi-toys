'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Application = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _playNotes = require('./play-notes');

var _arrowsLogic = require('./arrows-logic');

var _animations = require('./animations');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const chance = new Chance();
const maxArrows = 100;
const minArrows = 0;
const maxSize = 200;
const minSize = 1;
const minNoteLength = 10;
const maxNoteLength = 5000;
const interactSound = function (note, state) {
    return state.muted ? undefined : (0, _playNotes.makePizzaSound)(note, 50).play();
};
class Application extends _react2.default.Component {
    constructor(props) {
        var _this;

        _this = super(props);

        this.play = function () {
            _this.timerID = setInterval(function () {
                return _this.nextGrid(_this.state.noteLength);
            }, _this.state.noteLength);
            _this.setState({ playing: true });
            interactSound(6, _this.state);
        };

        this.pause = function () {
            clearInterval(_this.timerID);
            _this.setState({ playing: false });
            interactSound(5, _this.state);
        };

        this.muteToggle = function () {
            _this.setState({ muted: !_this.state.muted });
            interactSound(1, _this.state);
        };

        this.newSize = function (e) {
            let input = parseInt(e.target.value, 10);
            if (input > maxSize) {
                input = maxArrows;
            } else if (input < minSize) {
                input = minArrows;
            }
            _this.setState({
                gridSize: input,
                grid: _extends({}, _this.state.grid, {
                    size: input
                })
            });
            interactSound(2, _this.state);
        };

        this.newNoteLength = function (e) {
            clearInterval(_this.timerID);
            let input = parseInt(e.target.value, 10);
            if (input > maxNoteLength) {
                input = maxNoteLength;
            } else if (input < minNoteLength) {
                input = minNoteLength;
            }
            _this.setState({
                noteLength: input
            });
            _this.play();
            interactSound(3, _this.state);
        };

        this.newNumberOfArrows = function (e) {
            let input = parseInt(e.target.value, 10);
            if (input > maxArrows) {
                input = maxArrows;
            } else if (input < minArrows) {
                input = minArrows;
            }
            _this.setState({
                numberOfArows: input
            });
            // this.newGrid(input, this.state.gridSize)
            interactSound(4, _this.state);
        };

        this.nextGrid = function (length) {
            _this.setState({
                grid: (0, _arrowsLogic.nextGrid)(_extends({}, _this.state.grid, { muted: _this.state.muted }), length)
            });
        };

        this.newInputDirection = function (inputDirection) {
            _this.setState({
                inputDirection
            });
        };

        this.newGrid = function (number, size) {
            _this.setState({
                grid: (0, _arrowsLogic.newGrid)(size, number)
            });
        };

        this.addToGrid = function (x, y, e) {
            if (e.shiftKey) {
                _this.setState({
                    grid: (0, _arrowsLogic.removeFromGrid)(_this.state.grid, x, y)
                });
            } else {
                _this.setState({
                    grid: (0, _arrowsLogic.addToGrid)(_this.state.grid, x, y, _this.state.inputDirection)
                });
            }
        };

        this.state = {
            gridSize: 8,
            inputDirection: 0,
            noteLength: 150,
            numberOfArows: 0,
            grid: (0, _arrowsLogic.newGrid)(8, 8),
            playing: true,
            muted: true
        };
        (0, _animations.setUpCanvas)(this.state, this.addToGrid);
    }

    componentDidMount() {
        this.play();
    }

    render() {
        var _this2 = this;

        const newDate = new Date();
        (0, _animations.updateCanvas)(this.state, newDate);
        return _react2.default.createElement(
            'div',
            { className: 'midi-toys-app' },
            _react2.default.createElement(
                'label',
                { htmlFor: 'mute-unmute', className: 'arrow-input-label' },
                'Sound:'
            ),
            _react2.default.createElement(
                'button',
                { id: 'mute-unmute', className: 'arrow-input', onClick: this.muteToggle },
                this.state.muted ? 'Turn Sound On' : 'Turn Sound Off'
            ),
            _react2.default.createElement(
                'label',
                { htmlFor: 'clear-button', className: 'arrow-input-label' },
                'Clear:'
            ),
            _react2.default.createElement(
                'button',
                { id: 'clear-button', className: 'arrow-input', onClick: function () {
                        return _this2.newGrid(_this2.state.numberOfArows, _this2.state.gridSize);
                    } },
                'Clear'
            ),
            _react2.default.createElement(
                'label',
                { htmlFor: 'max-note-length', className: 'arrow-input-label' },
                'Time per Step:'
            ),
            _react2.default.createElement('input', { id: 'max-note-length', className: 'arrow-input', type: 'number', max: maxNoteLength, min: minNoteLength, value: this.state.noteLength, onChange: this.newNoteLength }),
            _react2.default.createElement(
                'label',
                { htmlFor: 'arrow-input-number', className: 'arrow-input-label' },
                'Size of Grid:'
            ),
            _react2.default.createElement('input', { id: 'arrow-input-number', className: 'arrow-input', type: 'number', max: maxSize, min: minSize, value: this.state.gridSize, onChange: this.newSize }),
            _react2.default.createElement(
                'label',
                { htmlFor: 'arrow-input-id', className: 'arrow-input-label' },
                'Arrow Direction:'
            ),
            [_react2.default.createElement(
                'button',
                { id: 'arrow-input-id', className: 'arrow-input', onClick: function () {
                        return _this2.newInputDirection(1);
                    } },
                'Up'
            ), _react2.default.createElement(
                'button',
                { id: 'arrow-input-id', className: 'arrow-input', onClick: function () {
                        return _this2.newInputDirection(2);
                    } },
                'Right'
            ), _react2.default.createElement(
                'button',
                { id: 'arrow-input-id', className: 'arrow-input', onClick: function () {
                        return _this2.newInputDirection(3);
                    } },
                'Down'
            ), _react2.default.createElement(
                'button',
                { id: 'arrow-input-id', className: 'arrow-input', onClick: function () {
                        return _this2.newInputDirection(0);
                    } },
                'Left'
            )][this.state.inputDirection],
            _react2.default.createElement(
                'label',
                { htmlFor: 'play-stop', className: 'arrow-input-label' },
                'Start/Stop:'
            ),
            this.state.playing ? _react2.default.createElement(
                'button',
                { id: 'play-stop', className: 'arrow-input', onClick: this.pause },
                'Stop'
            ) : _react2.default.createElement(
                'button',
                { id: 'play-stop', className: 'arrow-input', onClick: this.play },
                'Start'
            ),
            _react2.default.createElement(
                'label',
                { htmlFor: 'sketch-holder', className: 'arrow-input-label' },
                'SHIFT + CLICK to clear a square'
            ),
            _react2.default.createElement('div', { id: 'sketch-holder' })
        );
    }
}
exports.Application = Application;