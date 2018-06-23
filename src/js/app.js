import React from 'react';
import {makePizzaSound} from './play-notes';
import {
    newGrid,
    nextGrid,
    removeFromGrid,
    addToGrid
} from './arrows-logic';
import {
    updateCanvas,
    setUpCanvas
} from './animations';

// const chance = new Chance();
const maxSize = 50;
const minSize = 2;
const minNoteLength = 50;
const maxNoteLength = 1000;
const interactSound = (note, state) => (state.muted ? undefined : makePizzaSound(note, 50).play());
export class Application extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gridSize: 8,
            inputDirection: 0,
            noteLength: 150,
            grid: newGrid(8, 8),
            playing: true,
            muted: true
        };
        setUpCanvas(this.state, this.addToGrid);
    }

    componentDidMount() {
        this.play();
    }
    play = () => {
        this.timerID = setInterval(
            () => this.nextGrid(this.state.noteLength),
            this.state.noteLength,
        );
        this.setState({ playing: true });
        interactSound(6, this.state);
    }
    resetTimer = () => {
        clearInterval(this.timerID);
        if (this.state.playing) {
            this.play();
        }
    }
    pause = () => {
        clearInterval(this.timerID);
        this.setState({ playing: false });
        interactSound(5, this.state);
    }
    muteToggle = () => {
        this.resetTimer();
        this.setState({ muted: !this.state.muted });
        interactSound(1, this.state);
    }
    newSize = (e) => {
        this.resetTimer();
        const input = parseInt(e.target.value, 10);

        this.setState({
            gridSize: input,
            grid: {
                ...this.state.grid,
                size: input,
            },
        });
        interactSound(2, this.state);
    }
    newNoteLength = (e) => {
        this.resetTimer();
        const input = parseInt(e.target.value, 10);

        this.setState({
            noteLength: input,
        });
        interactSound(3, this.state);
    }
    nextGrid = (length) => {
        this.setState({
            grid: nextGrid({ ...this.state.grid, muted: this.state.muted }, length),
        });
    }
    newInputDirection = (inputDirection) => {
        this.resetTimer();
        this.setState({
            inputDirection,
        });
    }
    newGrid = (number, size) => {
        this.setState({
            grid: newGrid(size, number),
        });
    }
    addToGrid = (x, y, e) => {
        if (e.shiftKey) {
            this.setState({
                grid: removeFromGrid(this.state.grid, x, y),
            });
        } else {
            this.setState({
                grid: addToGrid(this.state.grid, x, y, this.state.inputDirection),
            });
        }
    }
    render() {
        const newDate = new Date();
        updateCanvas(this.state, newDate);
        return (
            <div className="midi-toys-app">
                <label htmlFor="mute-unmute" className="arrow-input-label">Sound:</label>
                <button id="mute-unmute" className="arrow-input" onClick={this.muteToggle}>{this.state.muted ? 'Turn Sound On' : 'Turn Sound Off'}</button>
                <label htmlFor="clear-button" className="arrow-input-label">Clear:</label>
                <button id="clear-button" className="arrow-input" onClick={() => this.newGrid(0, this.state.gridSize)}>Clear</button>
                <label htmlFor="max-note-length" className="arrow-input-label">Time per Step:</label>
                <input id="max-note-length" className="arrow-input" type="range" max={maxNoteLength} min={minNoteLength} value={this.state.noteLength} onChange={this.newNoteLength} />
                <label htmlFor="arrow-input-number" className="arrow-input-label">Size of Grid:</label>
                <input id="arrow-input-number" className="arrow-input" type="range" max={maxSize} min={minSize} value={this.state.gridSize} onChange={this.newSize} />
                <label htmlFor="arrow-input-id" className="arrow-input-label">Arrow Direction:</label>
                {
                    [
                        (<button id="arrow-input-id" className="arrow-input" onClick={() => this.newInputDirection(1)}>Up</button>),
                        (<button id="arrow-input-id" className="arrow-input" onClick={() => this.newInputDirection(2)}>Right</button>),
                        (<button id="arrow-input-id" className="arrow-input" onClick={() => this.newInputDirection(3)}>Down</button>),
                        (<button id="arrow-input-id" className="arrow-input" onClick={() => this.newInputDirection(0)}>Left</button>),
                    ][this.state.inputDirection]
                }
                <label htmlFor="play-stop" className="arrow-input-label">Start/Stop:</label>
                {
                    this.state.playing ?
                        <button id="play-stop" className="arrow-input" onClick={this.pause}>Stop</button> :
                        <button id="play-stop" className="arrow-input" onClick={this.play}>Start</button>
                }
                <label htmlFor="sketch-holder" className="arrow-input-label">SHIFT + CLICK to clear a square</label>
                <div id="sketch-holder"/>
                <label htmlFor="midiOut" className="arrow-input-label">MIDI Output:</label>
                <select id="midiOut" className="arrow-input">
                    <option value="">Not connected</option>
                </select>
            </div>
        );
    }
}
