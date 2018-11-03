'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Application = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

var _presets = require('./presets');

var _presets2 = _interopRequireDefault(_presets);

var _scales = require('./scales');

var _scales2 = _interopRequireDefault(_scales);

var _reactDropdown = require('react-dropdown');

var _reactDropdown2 = _interopRequireDefault(_reactDropdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const clickNext = function () {
    const nextButtonElement = document.querySelectorAll('.introjs-button.introjs-nextbutton')[0];
    nextButtonElement && nextButtonElement.click();
};
const clickDone = function () {
    const doneButtonElement = document.querySelectorAll('.introjs-button.introjs-donebutton')[0];
    doneButtonElement && doneButtonElement.click();
};
const chance = new Chance();
const maxSize = 20;
const minSize = 2;
const minNoteLength = -500;
const maxNoteLength = -50;
const sound = {
    play: function () {
        const theSound = (0, _playNotes.makePizzaSound)(1, undefined, .001);
        theSound.play();
        setTimeout(function () {
            theSound.stop();
        }, 1);
    }
};
const interactSound = function (state) {
    return state.muted ? undefined : sound.play();
};
const putArrowsInGrid = function (arrows) {
    return { "size": 8, "arrows": arrows, "muted": true };
};
class Application extends _react2.default.Component {
    constructor(props) {
        var _this;

        _this = super(props);

        this.timerID = undefined;

        this.play = function () {
            clickNext();
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
            clickDone();
            _this.setState({ muted: !_this.state.muted });
            interactSound(_this.state);
        };

        this.changeEditMode = function () {
            _this.setState({ deleting: !_this.state.deleting });
        };

        this.newSize = function (value) {
            const input = parseInt(value, 10);

            _this.setState({
                grid: _extends({}, _this.state.grid, {
                    id: chance.guid(),
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
                grid: (0, _arrowsLogic.nextGrid)(_extends({}, _this.state.grid, {
                    id: chance.guid(),
                    muted: _this.state.muted
                }), length, _this.state.scale, _this.state.musicalKey)
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

        this.emptyGrid = function () {
            clickNext();
            _this.setState({
                grid: (0, _arrowsLogic.emptyGrid)(_this.state.grid.size)
            });
        };

        this.removeTutHighlight = function () {
            _this.setState({
                tut: ''
            });
        };

        this.addPreset = function () {

            const encoded = window.btoa(JSON.stringify({
                noteLength: _this.state.noteLength,
                grid: _this.state.grid
            }));
            console.log(encoded);
            // this.setState({
            //     presets: [
            //         ...this.state.presets,
            //         putArrowsInGrid(
            //             this.state.grid.arrows
            //         )
            //     ]
            // });
        };

        this.addToGrid = function (x, y, e, forced) {
            clickNext();
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
                    grid: (0, _arrowsLogic.addToGrid)(_this.state.grid, x, y, _this.state.inputDirection, symmetries, _this.state.inputNumber, forced)
                });
            }
        };

        this.share = function () {
            ga('send', {
                hitType: 'social',
                socialNetwork: 'Facebook',
                socialAction: 'share',
                socialTarget: 'http://myownpersonaldomain.com'
            });
            const gridString = window.btoa(JSON.stringify({
                grid: _this.state.grid,
                noteLength: _this.state.noteLength,
                muted: _this.state.muted
            }));
            const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Farrowgrid.sagaciasoft.com/?data=${gridString}&amp;src=sdkpreparse`;
            window.open(shareUrl, 'newwindow', 'width=300,height=250');return false;
        };

        this.state = {
            tut: "TutorialButtonStartGreen",
            currentPreset: -1,
            presets: _presets2.default,
            inputDirection: 0,
            noteLength: props.noteLength || 350,
            grid: props.grid || (0, _arrowsLogic.newGrid)(8, 6),
            playing: false,
            muted: true,
            deleting: false,
            horizontalSymmetry: false,
            verticalSymmetry: false,
            backwardDiagonalSymmetry: false,
            forwardDiagonalSymmetry: false,
            inputNumber: 1,
            scale,
            musicalKey
        };
        (0, _animations.setUpCanvas)(this.state);
    }

    componentDidMount() {
        // this.play();
        const idsAndCallbacks = [{ id: '#grid-size-slider', onChange: this.newSize }, { id: '#note-length-slider', onChange: this.newNoteLength }];
        (0, _sliders.setSliderOnChange)(idsAndCallbacks);

        (0, _animations.getAdderWithMousePosition)(this.addToGrid)();
    }

    render() {
        var _this2 = this;

        const options = Object.keys(_scales2.default).map(function (scale) {
            return { value: scale, label: _scales2.default[scale] };
        });
        // const options = [
        //     { value: 'one', label: 'One' },
        //     { value: 'two', label: 'Two', className: 'myOptionClassName' },
        //     {
        //      type: 'group', name: 'group1', items: [
        //        { value: 'three', label: 'Three', className: 'myOptionClassName' },
        //        { value: 'four', label: 'Four' }
        //      ]
        //     },
        //     {
        //      type: 'group', name: 'group2', items: [
        //        { value: 'five', label: 'Five' },
        //        { value: 'six', label: 'Six' }
        //      ]
        //     }
        // ];
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
                    { className: ' edit-options-member app-title-div' },
                    _react2.default.createElement(
                        'h1',
                        null,
                        'Arrowgrid'
                    )
                )
            ),
            _react2.default.createElement(
                'div',
                {
                    className: 'edit-options'
                },
                _react2.default.createElement(
                    'div',
                    { className: 'edit-options-member' },
                    _react2.default.createElement(
                        'div',
                        { className: '' },
                        _react2.default.createElement(
                            'button',
                            {
                                title: 'Start Tutorial',
                                className: "TutorialButton isEnabled " + this.state.tut,
                                onClick: function () {
                                    _this2.removeTutHighlight();
                                    introJs().setOption('hideNext', true).setOption('hidePrev', true).setOption('showBullets', false).setOption('nextLabel', '').setOption('prevLabel', '').setOption('skipLabel', '').setOption('doneLabel', '').setOption('showStepNumbers', false).setOption('exitOnOverlayClick', false).start();
                                }
                            },
                            _react2.default.createElement(_icons.InfoIcon, null)
                        )
                    )
                ),
                _react2.default.createElement(
                    'div',
                    {
                        className: 'edit-options-member'
                    },
                    _react2.default.createElement(
                        'div',
                        {
                            className: 'slider-container'
                            // data-step="5"
                            // data-intro="Adjust the speed with this slider."
                        },
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
                        {
                            className: 'slider-icon-container'
                        },
                        _react2.default.createElement(_icons.RabbitIcon, null),
                        _react2.default.createElement(_icons.TurtleIcon, null)
                    )
                ),
                _react2.default.createElement(
                    'div',
                    {
                        className: 'edit-options-member',
                        'data-step': '8',
                        'data-intro': 'Hear the thing.',
                        title: 'Sound On/Off'
                    },
                    _react2.default.createElement(_reactPlayerControls.MuteToggleButton, {
                        isEnabled: true,
                        isMuted: this.state.muted,
                        onMuteChange: this.muteToggle
                    })
                )
            ),
            _react2.default.createElement(
                'div',
                {
                    className: 'edit-options'
                },
                _react2.default.createElement(
                    'div',
                    {
                        className: 'edit-options-member',
                        'data-step': '5',
                        'data-intro': 'Swipe Right!'
                    },
                    _react2.default.createElement(
                        'div',
                        {
                            className: 'edit-options-member'
                            // data-step="6"
                            // data-intro="Repeat!"
                        },
                        _react2.default.createElement('div', {
                            id: 'sketch-holder'
                            // data-step="7"
                            // data-intro="Once more."
                        })
                    )
                )
            ),
            _react2.default.createElement(
                'div',
                {
                    className: 'edit-options'
                },
                _react2.default.createElement(
                    'div',
                    {
                        className: 'edit-options-member'
                        // data-step="11"
                        // data-intro="Change the arrow direction."
                    },
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
                    })][this.state.inputDirection]
                ),
                _react2.default.createElement(
                    'div',
                    {
                        className: 'edit-options-member'
                    },
                    _react2.default.createElement(
                        'div',
                        {
                            className: 'slider-container'
                            // data-step="12"
                            // data-intro="Adjust the grid with this slider."
                        },
                        _react2.default.createElement('input', {
                            id: 'grid-size-slider',
                            className: 'arrow-input',
                            type: 'range',
                            max: maxSize,
                            min: minSize,
                            value: this.state.grid.size
                        })
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'slider-icon-container' },
                        _react2.default.createElement(_icons.LargeGridIcon, null),
                        _react2.default.createElement(_icons.SmallGridIcon, null)
                    )
                ),
                _react2.default.createElement(
                    'div',
                    {
                        className: 'edit-options-member'
                        // data-step="6"
                        // data-intro="Switch to erase mode."
                    },
                    _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(_editButton.EditButton, { isEditing: !this.state.deleting, onClick: this.changeEditMode, className: this.state.deleting ? 'EraseIconRotate' : 'EditIconRotate' })
                    )
                )
            ),
            _react2.default.createElement(
                'div',
                { className: 'edit-options' },
                _react2.default.createElement(
                    'div',
                    { className: 'edit-options-member' },
                    _react2.default.createElement(_reactPlayerControls.PrevButton, {
                        onClick: function () {
                            let NextPreset = _this2.state.currentPreset - 1;

                            if (NextPreset < 0) {
                                NextPreset = _this2.state.presets.length - 1;
                            }

                            _this2.setState({
                                grid: _this2.state.presets[NextPreset],
                                currentPreset: NextPreset
                            });
                        },
                        isEnabled: true
                    })
                ),
                _react2.default.createElement(
                    'div',
                    {
                        className: 'edit-options-member',
                        'data-step': '1',
                        'data-intro': 'Start the thing.'
                    },
                    _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(
                            'div',
                            null,
                            this.state.playing ? _react2.default.createElement(_reactPlayerControls.PauseButton, { onClick: this.pause }) : _react2.default.createElement(_reactPlayerControls.PlayButton, { isEnabled: true, onClick: this.play })
                        )
                    )
                ),
                _react2.default.createElement(
                    'div',
                    {
                        className: 'edit-options-member',
                        'data-step': '2',
                        'data-intro': 'Change the thing.'
                    },
                    _react2.default.createElement(
                        'div',
                        {
                            className: 'edit-options-member'
                            // data-step="3"
                            // data-intro="Again!"
                        },
                        _react2.default.createElement(_reactPlayerControls.NextButton, {
                            onClick: function () {
                                clickNext();
                                let NextPreset = _this2.state.currentPreset + 1;

                                if (NextPreset >= _this2.state.presets.length) {
                                    NextPreset = 0;
                                }

                                _this2.setState({
                                    grid: _this2.state.presets[NextPreset],
                                    currentPreset: NextPreset
                                });
                            },
                            isEnabled: true
                        })
                    )
                )
            ),
            _react2.default.createElement(
                'div',
                { className: 'edit-options' },
                _react2.default.createElement(
                    'div',
                    {
                        className: 'edit-options-member',
                        'data-step': '4',
                        'data-intro': 'Trash the thing.'
                    },
                    _react2.default.createElement(_trashButton.TrashButton, { onClick: this.emptyGrid })
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'spacer-div-next-to-trash' },
                    _react2.default.createElement(
                        'h4',
                        null,
                        'Draw Mode: ',
                        !this.state.deleting ? '' + ["Up", "Right", "Down", "Left"][this.state.inputDirection] + ' Arrows' : 'Eraser'
                    )
                ),
                _react2.default.createElement(
                    'div',
                    {
                        className: 'edit-options-member'
                        // data-step="16"
                        // data-intro="Share your creation on Facebook!"
                    },
                    _react2.default.createElement(
                        'button',
                        {
                            title: 'Facebook Share',
                            className: 'ShareButton isEnabled',
                            onClick: this.share
                        },
                        _react2.default.createElement(_icons.ShareIcon, null)
                    )
                )
            ),
            _react2.default.createElement(
                'select',
                { id: 'midiOut', className: 'arrow-input' },
                _react2.default.createElement(
                    'option',
                    { value: '' },
                    'Not connected'
                )
            ),
            _react2.default.createElement(_reactDropdown2.default, {
                options: options,
                onChange: function (e) {
                    console.log(e);
                },
                value: this.state.scale,
                placeholder: 'Select an scale'
            })
        );
    }
}

exports.Application = Application; /* <SymmetryButton 
                                       onClick={
                                           ()=>this.setState({
                                               backwardDiagonalSymmetry: !this.state.backwardDiagonalSymmetry
                                           }
                                       )}
                                       isActive={this.state.backwardDiagonalSymmetry}
                                       className={"backward-diag"}
                                   />
                                   <SymmetryButton
                                       onClick={
                                           ()=>this.setState({
                                               forwardDiagonalSymmetry: !this.state.forwardDiagonalSymmetry
                                           }
                                       )}
                                       isActive={this.state.forwardDiagonalSymmetry}
                                       className={"forward-diag"}
                                   />
                                   <SymmetryButton
                                       onClick={
                                           ()=>this.setState({
                                               horizontalSymmetry: !this.state.horizontalSymmetry
                                           }
                                       )}
                                       isActive={this.state.horizontalSymmetry}
                                       className={"horizontal"}
                                   />
                                   <SymmetryButton
                                       onClick={
                                           ()=>this.setState({
                                               verticalSymmetry: !this.state.verticalSymmetry
                                           }
                                       )}
                                       isActive={this.state.verticalSymmetry}
                                       className={""}
                                   />  <PlusButton 
                                       onClick={
                                           ()=>this.setState({
                                               inputNumber: ((this.state.inputNumber + 1) % 5) || 1
                                           }
                                       )}
                                   /> */