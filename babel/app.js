'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Application = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
// import {EraseButton} from './buttons/erase-button';


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactPlayerControls = require('react-player-controls');

var _playNotes = require('./play-notes');

var _arrowsLogic = require('./arrows-logic');

var _animations = require('./animations');

var _trashButton = require('./buttons/trash-button');

var _editButton = require('./buttons/edit-button');

var _arrowButton = require('./buttons/arrow-button');

var _symmetryButton = require('./buttons/symmetry-button');

var _plusButton = require('./buttons/plus-button');

var _icons = require('./buttons/icons');

var _sliders = require('./sliders');

var _presets = require('../assets/presets');

var _presets2 = _interopRequireDefault(_presets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const chance = new Chance();
const maxSize = 20;
const minSize = 2;
const minNoteLength = -500;
const maxNoteLength = -50;
const interactSound = function (note, state) {
    return state.muted ? undefined : (0, _playNotes.makePizzaSound)(note, 50).play();
};
class Application extends _react2.default.Component {
    constructor(props) {
        var _this;

        _this = super(props);

        // const preset = JSON.parse('{"size":8,"arrows":[{"x":4,"y":4,"vector":1},{"x":4,"y":4,"vector":1},{"x":4,"y":4,"vector":1},{"x":3,"y":3,"vector":0},{"x":3,"y":3,"vector":0},{"x":3,"y":3,"vector":0},{"x":4,"y":4,"vector":2},{"x":4,"y":4,"vector":2},{"x":4,"y":4,"vector":2},{"x":3,"y":3,"vector":3},{"x":3,"y":3,"vector":3},{"x":3,"y":3,"vector":3},{"x":5,"y":5,"vector":2},{"x":5,"y":5,"vector":2},{"x":5,"y":5,"vector":2},{"x":5,"y":5,"vector":3},{"x":5,"y":5,"vector":3},{"x":5,"y":5,"vector":3},{"x":2,"y":2,"vector":0},{"x":2,"y":2,"vector":0},{"x":2,"y":2,"vector":0},{"x":2,"y":2,"vector":1},{"x":2,"y":2,"vector":1},{"x":2,"y":2,"vector":1},{"x":4,"y":3,"vector":1},{"x":4,"y":3,"vector":1},{"x":4,"y":3,"vector":1},{"x":3,"y":4,"vector":2},{"x":3,"y":4,"vector":2},{"x":3,"y":4,"vector":2},{"x":4,"y":3,"vector":0},{"x":4,"y":3,"vector":0},{"x":4,"y":3,"vector":0},{"x":3,"y":4,"vector":3},{"x":3,"y":4,"vector":3},{"x":3,"y":4,"vector":3},{"x":5,"y":2,"vector":1},{"x":5,"y":2,"vector":1},{"x":5,"y":2,"vector":1},{"x":5,"y":2,"vector":2},{"x":5,"y":2,"vector":2},{"x":5,"y":2,"vector":2},{"x":2,"y":5,"vector":0},{"x":2,"y":5,"vector":0},{"x":2,"y":5,"vector":0},{"x":2,"y":5,"vector":3},{"x":2,"y":5,"vector":3},{"x":2,"y":5,"vector":3}],"muted":true}');
        this.timerID = undefined;

        this.play = function () {
            _this.timerID = setInterval(function () {
                return _this.nextGrid(_this.state.noteLength);
            }, _this.state.noteLength);
            _this.setState({ playing: true });
        };

        this.resetTimer = function () {
            clearInterval(_this.timerID);
            if (_this.state.playing) {
                _this.play();
            }
        };

        this.pause = function () {
            clearInterval(_this.timerID);
            _this.setState({ playing: false });
        };

        this.muteToggle = function () {
            _this.resetTimer();
            _this.setState({ muted: !_this.state.muted });
            interactSound(1, _this.state);
        };

        this.changeEditMode = function () {
            _this.resetTimer();
            _this.setState({ deleting: !_this.state.deleting });
        };

        this.newSize = function (value) {
            _this.resetTimer();
            const input = parseInt(value, 10);

            _this.setState({
                gridSize: input,
                grid: _extends({}, _this.state.grid, {
                    size: input
                })
            });
        };

        this.newNoteLength = function (value) {
            _this.resetTimer();
            const input = parseInt(value, 10);

            _this.setState({
                noteLength: -1 * input
            });
        };

        this.nextGrid = function (length) {
            _this.setState({
                grid: (0, _arrowsLogic.nextGrid)(_extends({}, _this.state.grid, { muted: _this.state.muted }), length)
            });
        };

        this.newInputDirection = function (inputDirection) {
            _this.resetTimer();
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
            if (e.shiftKey || _this.state.deleting) {
                _this.setState({
                    grid: (0, _arrowsLogic.removeFromGrid)(_this.state.grid, x, y)
                });
            } else {
                const symmetries = {
                    horizontalSymmetry: _this.state.horizontalSymmetry,
                    verticalSymmetry: _this.state.verticalSymmetry,
                    backwardDiagonalSymmetry: _this.state.backwardDiagonalSymmetry,
                    forwardDiagonalSymmetry: _this.state.forwardDiagonalSymmetry
                };
                _this.setState({
                    grid: (0, _arrowsLogic.addToGrid)(_this.state.grid, x, y, _this.state.inputDirection, symmetries, _this.state.inputNumber)
                });
            }
        };

        const preset = JSON.parse('{"size":8,"arrows":[{"x":1,"y":7,"vector":0},{"x":1,"y":0,"vector":2},{"x":6,"y":7,"vector":0},{"x":6,"y":0,"vector":2},{"x":0,"y":6,"vector":1},{"x":7,"y":6,"vector":3},{"x":0,"y":1,"vector":1},{"x":7,"y":1,"vector":3},{"x":2,"y":6,"vector":0},{"x":2,"y":1,"vector":2},{"x":5,"y":6,"vector":0},{"x":5,"y":1,"vector":2},{"x":1,"y":5,"vector":1},{"x":6,"y":5,"vector":3},{"x":1,"y":2,"vector":1},{"x":6,"y":2,"vector":3},{"x":3,"y":5,"vector":0},{"x":3,"y":2,"vector":2},{"x":4,"y":5,"vector":0},{"x":4,"y":2,"vector":2},{"x":2,"y":4,"vector":1},{"x":5,"y":4,"vector":3},{"x":2,"y":3,"vector":1},{"x":5,"y":3,"vector":3},{"x":0,"y":5,"vector":0},{"x":0,"y":2,"vector":2},{"x":7,"y":5,"vector":0},{"x":7,"y":2,"vector":2},{"x":2,"y":7,"vector":1},{"x":5,"y":7,"vector":3},{"x":2,"y":0,"vector":1},{"x":5,"y":0,"vector":3},{"x":1,"y":4,"vector":0},{"x":1,"y":3,"vector":2},{"x":6,"y":4,"vector":0},{"x":6,"y":3,"vector":2},{"x":3,"y":6,"vector":1},{"x":4,"y":6,"vector":3},{"x":3,"y":1,"vector":1},{"x":4,"y":1,"vector":3},{"x":3,"y":3,"vector":0},{"x":3,"y":3,"vector":0},{"x":3,"y":4,"vector":2},{"x":3,"y":4,"vector":2},{"x":4,"y":3,"vector":0},{"x":4,"y":3,"vector":0},{"x":4,"y":4,"vector":2},{"x":4,"y":4,"vector":2},{"x":4,"y":4,"vector":1},{"x":4,"y":4,"vector":1},{"x":3,"y":4,"vector":3},{"x":3,"y":4,"vector":3},{"x":4,"y":3,"vector":1},{"x":4,"y":3,"vector":1},{"x":3,"y":3,"vector":3},{"x":3,"y":3,"vector":3}],"muted":true}');

        this.state = {
            gridSize: 8,
            inputDirection: 0,
            noteLength: 350,
            grid: preset,
            // grid: newGrid(8, 8),
            playing: false,
            muted: true,
            deleting: false,
            horizontalSymmetry: false,
            verticalSymmetry: false,
            backwardDiagonalSymmetry: false,
            forwardDiagonalSymmetry: false,
            inputNumber: 1
        };
        (0, _animations.setUpCanvas)(this.state, this.addToGrid);
    }

    componentDidMount() {
        // this.play();
        const idsAndCallbacks = [{ id: '#grid-size-slider', onChange: this.newSize }, { id: '#note-length-slider', onChange: this.newNoteLength }];
        (0, _sliders.setSliderOnChange)(idsAndCallbacks);
    }

    render() {
        var _this2 = this;

        const newDate = new Date();
        (0, _animations.updateCanvas)(this.state, newDate);
        return _react2.default.createElement(
            'div',
            { className: 'no-copy midi-toys-app' },
            _react2.default.createElement(
                'div',
                { className: 'edit-options' },
                _react2.default.createElement(
                    'div',
                    { className: 'edit-options-member' },
                    _react2.default.createElement(_reactPlayerControls.PrevButton, { onClick: function () {}, isEnabled: true })
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'edit-options-member' },
                    _react2.default.createElement(_reactPlayerControls.MuteToggleButton, {
                        isEnabled: true,
                        isMuted: this.state.muted,
                        onMuteChange: this.muteToggle
                    })
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'edit-options-member' },
                    this.state.playing ? _react2.default.createElement(_reactPlayerControls.PauseButton, { onClick: this.pause }) : _react2.default.createElement(_reactPlayerControls.PlayButton, { isEnabled: true, onClick: this.play })
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'edit-options-member' },
                    _react2.default.createElement(_reactPlayerControls.NextButton, { onClick: function () {}, isEnabled: true })
                )
            ),
            _react2.default.createElement(
                'div',
                { className: 'slider-container' },
                _react2.default.createElement('input', {
                    id: 'note-length-slider',
                    className: 'arrow-input',
                    type: 'range',
                    max: maxNoteLength,
                    min: minNoteLength,
                    value: -1 * this.state.noteLength
                })
            ),
            _react2.default.createElement(
                'div',
                { className: 'slider-icon-container' },
                _react2.default.createElement(_icons.RabbitIcon, null),
                _react2.default.createElement(_icons.TurtleIcon, null)
            ),
            _react2.default.createElement('div', { id: 'sketch-holder' }),
            _react2.default.createElement(
                'div',
                { className: 'slider-container' },
                _react2.default.createElement('input', {
                    id: 'grid-size-slider',
                    className: 'arrow-input',
                    type: 'range',
                    max: maxSize,
                    min: minSize,
                    value: this.state.gridSize
                })
            ),
            _react2.default.createElement(
                'div',
                { className: 'slider-icon-container' },
                _react2.default.createElement(_icons.LargeGridIcon, null),
                _react2.default.createElement(_icons.SmallGridIcon, null)
            ),
            _react2.default.createElement(_symmetryButton.SymmetryButton, {
                onClick: function () {
                    return _this2.setState({
                        backwardDiagonalSymmetry: !_this2.state.backwardDiagonalSymmetry
                    });
                },
                isActive: this.state.backwardDiagonalSymmetry,
                className: "backward-diag"
            }),
            _react2.default.createElement(_symmetryButton.SymmetryButton, {
                onClick: function () {
                    return _this2.setState({
                        forwardDiagonalSymmetry: !_this2.state.forwardDiagonalSymmetry
                    });
                },
                isActive: this.state.forwardDiagonalSymmetry,
                className: "forward-diag"
            }),
            _react2.default.createElement(_symmetryButton.SymmetryButton, {
                onClick: function () {
                    return _this2.setState({
                        horizontalSymmetry: !_this2.state.horizontalSymmetry
                    });
                },
                isActive: this.state.horizontalSymmetry,
                className: "horizontal"
            }),
            _react2.default.createElement(_symmetryButton.SymmetryButton, {
                onClick: function () {
                    return _this2.setState({
                        verticalSymmetry: !_this2.state.verticalSymmetry
                    });
                },
                isActive: this.state.verticalSymmetry,
                className: ""
            }),
            [_react2.default.createElement(_arrowButton.ArrowButton, {
                number: this.state.inputNumber,
                onClick: function () {
                    return _this2.newInputDirection(1);
                },
                direction: 'Up'
            }), _react2.default.createElement(_arrowButton.ArrowButton, {
                number: this.state.inputNumber,
                onClick: function () {
                    return _this2.newInputDirection(2);
                },
                direction: 'Right'
            }), _react2.default.createElement(_arrowButton.ArrowButton, {
                number: this.state.inputNumber,
                onClick: function () {
                    return _this2.newInputDirection(3);
                },
                direction: 'Down'
            }), _react2.default.createElement(_arrowButton.ArrowButton, {
                number: this.state.inputNumber,
                onClick: function () {
                    return _this2.newInputDirection(0);
                },
                direction: 'Left'
            })][this.state.inputDirection],
            _react2.default.createElement(_plusButton.PlusButton, {
                onClick: function () {
                    return _this2.setState({
                        inputNumber: (_this2.state.inputNumber + 1) % 5 || 1
                    });
                }
            }),
            _react2.default.createElement(_editButton.EditButton, { isEditing: !this.state.deleting, onClick: this.changeEditMode, className: this.state.deleting ? 'EraseIconRotate' : 'EditIconRotate' }),
            _react2.default.createElement(_trashButton.TrashButton, { onClick: function () {
                    return _this2.newGrid(0, _this2.state.gridSize);
                } }),
            _react2.default.createElement(
                'select',
                { id: 'midiOut', className: 'arrow-input' },
                _react2.default.createElement(
                    'option',
                    { value: '' },
                    'Not connected'
                )
            )
        );
    }
}
exports.Application = Application;