'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Application = exports.nextGrid = exports.playSounds = exports.flipArrow = exports.rotateSet = exports.rotateArrow = exports.newArrayIfFalsey = exports.arrowBoundaryKey = exports.arrowKey = exports.moveArrow = exports.seedGrid = exports.newGrid = exports.addToGrid = exports.removeFromGrid = exports.getArrow = exports.getRows = exports.getRandomNumber = exports.cycleVector = exports.getVector = exports.vectorOperations = exports.vectors = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _pizzicato = require('pizzicato');

var _pizzicato2 = _interopRequireDefault(_pizzicato);

var _notesFrequencies = require('notes-frequencies');

var _notesFrequencies2 = _interopRequireDefault(_notesFrequencies);

var _os = require('os');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const chance = new _chance2.default();
const vectors = exports.vectors = ['arrow-up', 'arrow-right', 'arrow-down', 'arrow-left'];
const vectorOperations = exports.vectorOperations = [function ({ x, y, vector }) {
  return { x, y: y - 1, vector };
}, function ({ x, y, vector }) {
  return { x: x + 1, y, vector };
}, function ({ x, y, vector }) {
  return { x, y: y + 1, vector };
}, function ({ x, y, vector }) {
  return { x: x - 1, y, vector };
}];
const getVector = exports.getVector = function () {
  return chance.natural({
    min: 0,
    max: 3
  });
};
const cycleVector = exports.cycleVector = function (vector, number) {
  return (vector + number - 1) % 4;
};
const getRandomNumber = exports.getRandomNumber = function (size) {
  return chance.natural({
    min: 0,
    max: size - 1
  });
};
const getRows = exports.getRows = function (size) {
  return R.range(0, size).map(function () {
    return R.range(0, size);
  });
};
const getArrow = exports.getArrow = function (size) {
  return function () {
    return {
      x: getRandomNumber(size),
      y: getRandomNumber(size),
      vector: getVector()
    };
  };
};
const removeFromGrid = exports.removeFromGrid = function (grid, x, y) {
  const nextGrid = _extends({}, grid, {
    arrows: grid.arrows.filter(function (arrow) {
      return arrow.x !== x || arrow.y !== y;
    })
  });
  return nextGrid;
};
const addToGrid = exports.addToGrid = function (grid, x, y, dir) {
  const nextGrid = _extends({}, grid, {
    arrows: [...grid.arrows, {
      x,
      y,
      vector: dir
    }]
  });
  return nextGrid;
};
const newGrid = exports.newGrid = function (size, numberOfArrows) {
  const arrows = R.range(0, numberOfArrows).map(getArrow(size));

  return { size, arrows, muted: true };
};
const seedGrid = exports.seedGrid = function () {
  return newGrid(getRandomNumber(20) + 12, getRandomNumber(50) + 1);
};
const moveArrow = exports.moveArrow = function (arrow) {
  return vectorOperations[arrow.vector](arrow);
};
const arrowKey = exports.arrowKey = function (arrow) {
  return '{x:' + arrow.x + ',y:' + arrow.y + '}';
};
const arrowBoundaryKey = exports.arrowBoundaryKey = function (arrow, size) {
  if (arrow.y === 0 && arrow.vector === 0) {
    return 'boundary';
  }
  if (arrow.x === size - 1 && arrow.vector === 1) {
    return 'boundary';
  }
  if (arrow.y === size - 1 && arrow.vector === 2) {
    return 'boundary';
  }
  if (arrow.x === 0 && arrow.vector === 3) {
    return 'boundary';
  }
  return 'no-boundary';
};
const newArrayIfFalsey = exports.newArrayIfFalsey = function (thingToCheck) {
  return thingToCheck ? thingToCheck : [];
};
const rotateArrow = exports.rotateArrow = function (number) {
  return function (arrow) {
    return _extends({}, arrow, {
      vector: cycleVector(arrow.vector, number)
    });
  };
};
const rotateSet = exports.rotateSet = function (set) {
  return set.map(rotateArrow(set.length));
};
const flipArrow = function (_ref) {
  let { vector } = _ref,
      rest = _objectWithoutProperties(_ref, ['vector']);

  return _extends({ vector: (vector + 2) % 4 }, rest);
};

exports.flipArrow = flipArrow;
function sound(src, speed) {
  const aSound = document.createElement("audio");
  aSound.src = src;
  aSound.setAttribute("preload", "auto");
  aSound.setAttribute("controls", "none");
  aSound.style.display = "none";
  aSound.setAttribute("playbackRate", speed);
  document.body.appendChild(aSound);
  return {
    play: function () {
      aSound.play();
      setTimeout(function () {
        return document.body.removeChild(aSound);
      }, 500);
    }
  };
}
const getIndex = function (x, y, size, vector) {
  if (vector === 1 || vector === 3) {
    return y;
  } else if (vector === 0 || vector === 2) {
    return x;
  }
  return 0;
};

const makeMIDImessage = function (index, length) {

  const midiKeyNumbers = [45, 47, 48, 50, 52, 54, 55, 57, 59, 61, 62, 64, 66, 67, 69, 71, 73, 74];
  const noteIndex = index % midiKeyNumbers.length;

  return {
    play: function () {
      (midiOut || { send: function () {} }).send([0x90, midiKeyNumbers[noteIndex], 0x40]);
      setTimeout(function () {
        const midcon = (midiOut || { send: function () {} }).send([0x80, midiKeyNumbers[noteIndex], 0x00]);
      }, length - 1);
    }
  };
};
const makePizzaSound = function (index, length) {

  // const frequencies = notesFrequencies('D3 F3 G#3 C4 D#4 G4 A#5');
  const frequencies = (0, _notesFrequencies2.default)('A3 B3 C3 D3 E3 F3 G3 A4 B4 C4 D4 E4 F4 G4 A5 B5 C5 D5 E5 F5 G5');
  const noteIndex = index % frequencies.length;
  const aSound = new _pizzicato2.default.Sound({
    source: 'wave',
    options: {
      frequency: frequencies[noteIndex][0],
      attack: 0.1,
      release: 0.1,
      type: 'triangle'
    }
  });
  var distortion = new _pizzicato2.default.Effects.Distortion({
    gain: 0.8
  });

  aSound.addEffect(distortion);

  var reverb = new _pizzicato2.default.Effects.Reverb({
    time: length / 2.0,
    decay: length / 2.0,
    reverse: true,
    mix: 0.7
  });

  aSound.addEffect(reverb);
  return {
    play: function () {
      aSound.play();
      setTimeout(function () {
        aSound.stop();
      }, length - 1);
    }
  };
};
const playSounds = exports.playSounds = function (boundaryArrows, size, length, muted) {
  boundaryArrows.map(function (arrow) {
    const speed = getIndex(arrow.x, arrow.y, size, arrow.vector);

    if (!muted) {
      const snd = makePizzaSound(speed, length);
      snd.play();
    }

    const midiMessage = makeMIDImessage(speed, length);
    midiMessage.play();
  });
};
const reduceArrowNumber = function (x) {
  return x;
}; //(arrowSet)=>R.take(arrowSet.length%4, arrowSet);//This has the side effect of destroying arrows that don't have the same vector
const nextGrid = exports.nextGrid = function (grid, length) {
  const size = grid.size;
  const arrows = grid.arrows;

  const arrowSetDictionary = arrows.reduce(function (arrowDictionary, arrow) {
    arrowDictionary[arrowKey(arrow)] = [...newArrayIfFalsey(arrowDictionary[arrowKey(arrow)]), arrow];
    return arrowDictionary;
  }, {});

  const noisyArrowBoundaryDictionary = arrows.reduce(function (arrowDictionary, arrow) {
    arrowDictionary[arrowBoundaryKey(arrow, size)] = [...newArrayIfFalsey(arrowDictionary[arrowBoundaryKey(arrow, size)]), arrow];
    return arrowDictionary;
  }, {});
  playSounds(newArrayIfFalsey(noisyArrowBoundaryDictionary['boundary']), size, length, grid.muted);

  const arrowSets = Object.keys(arrowSetDictionary).map(function (key) {
    return arrowSetDictionary[key];
  });
  const rotatedArrows = arrowSets.map(reduceArrowNumber).map(rotateSet);
  const flatRotatedArrows = rotatedArrows.reduce(function (accum, current) {
    return [...accum, ...current];
  }, []);

  const arrowBoundaryDictionary = flatRotatedArrows.reduce(function (arrowDictionary, arrow) {
    arrowDictionary[arrowBoundaryKey(arrow, size)] = [...newArrayIfFalsey(arrowDictionary[arrowBoundaryKey(arrow, size)]), arrow];
    return arrowDictionary;
  }, {});
  const movedArrowsInMiddle = newArrayIfFalsey(arrowBoundaryDictionary['no-boundary']).map(moveArrow);
  const movedFlippedBoundaryArrows = newArrayIfFalsey(arrowBoundaryDictionary['boundary']).map(flipArrow).map(moveArrow);

  return _extends({}, grid, {
    size,
    arrows: [...movedArrowsInMiddle, ...movedFlippedBoundaryArrows]
  });
};

const renderItem = function (item) {
  const classes = R.uniqBy(function (x) {
    return x.vector;
  }, item).map(function ({ vector }) {
    return vectors[vector];
  });
  if (item.length) {
    return _react2.default.createElement(
      'td',
      null,
      _react2.default.createElement(
        'div',
        { className: 'space', onClick: item.spawn },
        classes.map(function (divClass) {
          return _react2.default.createElement('div', { className: divClass });
        })
      )
    );
  }
  return _react2.default.createElement(
    'td',
    null,
    _react2.default.createElement('div', { className: 'space', onClick: item.spawn })
  );
};

const renderRow = function (row) {
  return _react2.default.createElement(
    'tr',
    { key: chance.guid() },
    row.map(renderItem)
  );
};
const renderGrid = function (grid, spawnArrowFunction) {

  const populateArrow = function (y) {
    return function (x) {
      return grid.arrows.filter(function (arrow) {
        return arrow.x === x && arrow.y === y;
      });
    };
  };
  const populateRow = function (row, index) {
    return row.map(populateArrow(index));
  };

  const populatedGrid = getRows(grid.size).map(populateRow);
  const addSpawnArrowToItem = function (y) {
    return function (item, x) {
      return Object.assign([...item], { spawn: function (e) {
          return spawnArrowFunction(x, y, e);
        } });
    };
  };
  const addSpawnArrowsToRow = function (row, index) {
    return row.map(addSpawnArrowToItem(index));
  };
  const populatedLivingGrid = populatedGrid.map(addSpawnArrowsToRow);
  return populatedLivingGrid.map(renderRow);
};

const maxArrows = 50;
const minArrows = 0;
const maxSize = 30;
const minSize = 1;
const minNoteLength = 1;
const maxNoteLength = 5000;
const interactSound = function (note, state) {
  return state.muted ? undefined : makePizzaSound(note, 50).play();
};
class Application extends _react2.default.Component {

  constructor(props) {
    super(props);

    this.state = {
      gridSize: 8,
      inputDirection: 0,
      noteLength: 150,
      numberOfArows: 8,
      grid: newGrid(8, 8),
      playing: true,
      muted: true
    };
    this.newSizeHandler = this.newSize.bind(this);
    this.newNoteLengthHandler = this.newNoteLength.bind(this);
    this.newNumberOfArrowsHandler = this.newNumberOfArrows.bind(this);
    this.nextGridHandler = this.nextGrid.bind(this);
    this.newGridHandler = this.newGrid.bind(this);
    this.playHandler = this.play.bind(this);
    this.pauseHandler = this.pause.bind(this);
    this.muteToggleHandler = this.muteToggle.bind(this);
    this.addToGridHandler = this.addToGrid.bind(this);
    this.newInputDirectionHandler = this.newInputDirection.bind(this);
  }

  componentDidMount() {
    this.playHandler();
  }
  play() {
    var _this = this;

    this.timerID = setInterval(function () {
      return _this.nextGridHandler(_this.state.noteLength);
    }, this.state.noteLength);
    this.setState({ playing: true });
    interactSound(6, this.state);
  }
  pause() {
    clearInterval(this.timerID);
    this.setState({ playing: false });
    interactSound(5, this.state);
  }
  muteToggle() {
    this.setState({ muted: !this.state.muted });
    interactSound(1, this.state);
  }
  newSize(e) {
    let input = parseInt(e.target.value);
    if (isNaN(input)) {
      input = 8;
    } else if (input > maxSize) {
      input = maxArrows;
    } else if (input < minSize) {
      input = minArrows;
    }
    this.setState({
      gridSize: input,
      grid: _extends({}, this.state.grid, {
        size: input
      })
    });
    interactSound(2, this.state);
  }
  newNoteLength(e) {
    clearInterval(this.timerID);
    let input = parseInt(e.target.value);
    if (isNaN(input)) {
      input = 150;
    } else if (input > maxNoteLength) {
      input = maxNoteLength;
    } else if (input < minNoteLength) {
      input = minNoteLength;
    }
    this.setState({
      noteLength: input
    });
    this.play();
    interactSound(3, this.state);
  }
  newNumberOfArrows(e) {
    let input = parseInt(e.target.value);
    if (isNaN(input)) {
      input = 8;
    } else if (input > maxArrows) {
      input = maxArrows;
    } else if (input < minArrows) {
      input = minArrows;
    }
    this.setState({
      numberOfArows: input
    });
    // this.newGridHandler(input, this.state.gridSize)
    interactSound(4, this.state);
  }
  nextGrid(length) {
    this.setState({
      grid: nextGrid(_extends({}, this.state.grid, { muted: this.state.muted }), length)
    });
  }
  newInputDirection(inputDirection) {
    this.setState({
      inputDirection
    });
  }
  newGrid(number, size) {
    this.setState({
      grid: newGrid(size, number)
    });
  }
  addToGrid(x, y, e) {

    if (e.shiftKey) {
      this.setState({
        grid: removeFromGrid(this.state.grid, x, y)
      });
    } else {
      this.setState({
        grid: addToGrid(this.state.grid, x, y, this.state.inputDirection)
      });
    }
  }
  render() {
    var _this2 = this;

    return _react2.default.createElement(
      'div',
      { className: 'midi-toys-app' },
      _react2.default.createElement(
        'label',
        { className: 'arrow-input-label' },
        'Sound:'
      ),
      _react2.default.createElement(
        'button',
        { className: 'arrow-input', onClick: this.muteToggleHandler },
        this.state.muted ? 'Turn Sound On' : 'Turn Sound Off'
      ),
      _react2.default.createElement(
        'label',
        { className: 'arrow-input-label' },
        'Reset:'
      ),
      _react2.default.createElement(
        'button',
        { className: 'arrow-input', onClick: function () {
            return _this2.newGridHandler(_this2.state.numberOfArows, _this2.state.gridSize);
          } },
        'Reset'
      ),
      _react2.default.createElement(
        'label',
        { className: 'arrow-input-label' },
        'Time per Step:'
      ),
      _react2.default.createElement('input', { className: 'arrow-input', type: 'number', max: maxNoteLength, min: minNoteLength, value: this.state.noteLength, onChange: this.newNoteLengthHandler }),
      _react2.default.createElement(
        'label',
        { className: 'arrow-input-label' },
        'Number of Arrows:'
      ),
      _react2.default.createElement('input', { className: 'arrow-input', type: 'number', max: maxArrows, min: minArrows, value: this.state.numberOfArows, onChange: this.newNumberOfArrowsHandler }),
      _react2.default.createElement(
        'label',
        { className: 'arrow-input-label' },
        'Size of Grid:'
      ),
      _react2.default.createElement('input', { className: 'arrow-input', type: 'number', max: maxSize, min: minSize, value: this.state.gridSize, onChange: this.newSizeHandler }),
      _react2.default.createElement(
        'label',
        { className: 'arrow-input-label' },
        'Arrow Direction:'
      ),
      [_react2.default.createElement(
        'button',
        { className: 'arrow-input', onClick: function () {
            return _this2.newInputDirectionHandler(1);
          } },
        'Up'
      ), _react2.default.createElement(
        'button',
        { className: 'arrow-input', onClick: function () {
            return _this2.newInputDirectionHandler(2);
          } },
        'Right'
      ), _react2.default.createElement(
        'button',
        { className: 'arrow-input', onClick: function () {
            return _this2.newInputDirectionHandler(3);
          } },
        'Down'
      ), _react2.default.createElement(
        'button',
        { className: 'arrow-input', onClick: function () {
            return _this2.newInputDirectionHandler(0);
          } },
        'Left'
      )][this.state.inputDirection],
      _react2.default.createElement(
        'label',
        { className: 'arrow-input-label' },
        'Start/Stop:'
      ),
      this.state.playing ? _react2.default.createElement(
        'button',
        { className: 'arrow-input', onClick: this.pauseHandler },
        'Stop'
      ) : _react2.default.createElement(
        'button',
        { className: 'arrow-input', onClick: this.playHandler },
        'Start'
      ),
      _react2.default.createElement(
        'label',
        { className: 'arrow-input-label' },
        'CLICK to place an arrow'
      ),
      _react2.default.createElement(
        'label',
        { className: 'arrow-input-label' },
        'SHIFT + CLICK to clear a square'
      ),
      _react2.default.createElement(
        'table',
        { align: 'center' },
        _react2.default.createElement(
          'tbody',
          null,
          renderGrid(this.state.grid, this.addToGridHandler)
        )
      ),
      _react2.default.createElement(
        'label',
        { className: 'arrow-input-label' },
        'MIDI Output:'
      ),
      _react2.default.createElement(
        'select',
        { id: 'midiOut', className: 'arrow-input', onchange: 'changeMidiOut();' },
        _react2.default.createElement(
          'option',
          { value: '' },
          'Not connected'
        )
      ),
      _react2.default.createElement(
        'label',
        { className: 'arrow-input-label' },
        'Learn how to create a virtual midi bus:'
      ),
      _react2.default.createElement(
        'a',
        { href: 'http://www.tobias-erichsen.de/software/loopmidi.html', target: '_blank', className: 'aButton' },
        'Windows'
      ),
      _react2.default.createElement(
        'a',
        { href: 'https://help.ableton.com/hc/en-us/articles/209774225-Using-virtual-MIDI-buses', target: '_blank', className: 'aButton' },
        'Mac'
      ),
      _react2.default.createElement(
        'a',
        { href: 'credits.html', target: '_blank', className: 'aButton' },
        'Credits'
      )
    );
  }
}

exports.Application = Application;
function onMIDIFail(err) {
  alert("MIDI initialization failed.");
}

let selectMIDIOut = null;
let midiAccess = null;
let midiIn = null;
let midiOut = null;
let launchpadFound = false;

function changeMIDIOut(ev) {
  var selectedID = selectMIDIOut[selectMIDIOut.selectedIndex].value;

  for (var output of midiAccess.outputs.values()) {
    if (selectedID == output.id) {
      midiOut = output;
      return;
    }
  }
  midiOut = null;
}
function onMIDIInit(midi) {
  midiAccess = midi;
  selectMIDIOut = document.getElementById("midiOut");

  // clear the MIDI output select
  selectMIDIOut.options.length = 0;
  selectMIDIOut.add(new Option('Select Device', undefined, false, false));
  for (var output of midiAccess.outputs.values()) {
    selectMIDIOut.add(new Option(output.name, output.id, false, false));
  }
  selectMIDIOut.onchange = changeMIDIOut;
}

navigator.requestMIDIAccess({}).then(onMIDIInit, onMIDIFail);

particlesJS({
  "particles": {
    "number": {
      "value": 48,
      "density": {
        "enable": false,
        "value_area": 800
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#ffffff"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 40,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": false,
      "distance": 1603.412060865523,
      "color": "#ffffff",
      "opacity": 0.25,
      "width": 2.725800503471389
    },
    "move": {
      "enable": true,
      "speed": 14.430708547789706,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 2565.4592973848366,
        "rotateY": 3367.1653278175977
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
});

// var count_particles, stats, update;
//  stats = new Stats;
//   stats.setMode(0); 
//   stats.domElement.style.position = 'absolute'; 
//   stats.domElement.style.left = '0px';
//    stats.domElement.style.top = '0px'; 
//    document.body.appendChild(stats.domElement);
//     count_particles = document.querySelector('.js-count-particles'); update = function () { stats.begin();
//        stats.end(); 
//        if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) { 
//          count_particles.innerText = window.pJSDom[0].pJS.particles.array.length;
//          } requestAnimationFrame(update);
//          }; 
//          requestAnimationFrame(update);

_reactDom2.default.render(_react2.default.createElement(Application, null), document.getElementById('root'));
