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
const maxSize = 40;
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
            noteLength: 200,
            grid: newGrid(8, 8),
            playing: true,
            muted: true,
            deleting: false
        };
        setUpCanvas(this.state, this.addToGrid);
    }

    componentDidMount() {
        this.play();
    }

    timerID = undefined

    play = () => {
        this.timerID = setInterval(
            () => this.nextGrid(this.state.noteLength),
            this.state.noteLength,
        );
        this.setState({ playing: true });
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
    }
    muteToggle = () => {
        this.resetTimer();
        this.setState({ muted: !this.state.muted });
        interactSound(1, this.state);
    }
    changeEditMode = () => {
        this.resetTimer();
        this.setState({ deleting: !this.state.deleting });
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
    }
    newNoteLength = (e) => {
        const input = parseInt(e.target.value, 10);
        this.setState({
            noteLength: input,
        });
        clearInterval(this.timerID);
        this.timerID = setInterval(
            () => this.nextGrid(input),
            input,
        );
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
        if (e.shiftKey || this.state.deleting) {
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
                <button id="mute-unmute" className="arrow-input" onClick={this.muteToggle}>{this.state.muted ? 'Enable Sound' : 'Disable Sound'}</button>
                {
                    this.state.playing ?
                        <button id="play-stop" className="arrow-input" onClick={this.pause}>Stop</button> :
                        <button id="play-stop" className="arrow-input" onClick={this.play}>Start</button>
                }
                <label className="arrow-input-label">Time per Step:</label>
                <input id="max-note-length" className="arrow-input" type="range" max={maxNoteLength} min={minNoteLength} value={this.state.noteLength} onChange={this.newNoteLength} />
                <label className="arrow-input-label">Size of Grid:</label>
                <input id="arrow-input-number" className="arrow-input" type="range" max={maxSize} min={minSize} value={this.state.gridSize} onChange={this.newSize} />
                <div className="edit-options">
                    <div className="edit-options-member">
                        <label className="arrow-input-label">Edit Mode:</label>
                        {
                            this.state.deleting ?
                                <button id="arrow-input-id" className="arrow-input" onClick={this.changeEditMode}>Delete</button> :
                                <button id="arrow-input-id" className="arrow-input" onClick={this.changeEditMode}>Draw</button>
                        }
                    </div>
                    <div className="edit-options-member">
                        <label className="arrow-input-label">Arrow Direction:</label>
                        {
                            [
                                (<button id="arrow-input-id" className="arrow-input" onClick={() => this.newInputDirection(1)}>Up</button>),
                                (<button id="arrow-input-id" className="arrow-input" onClick={() => this.newInputDirection(2)}>Right</button>),
                                (<button id="arrow-input-id" className="arrow-input" onClick={() => this.newInputDirection(3)}>Down</button>),
                                (<button id="arrow-input-id" className="arrow-input" onClick={() => this.newInputDirection(0)}>Left</button>),
                            ][this.state.inputDirection]
                        }
                    </div>
                </div>
                <div id="sketch-holder"/>
                <button id="clear-button" className="arrow-input" onClick={() => this.newGrid(0, this.state.gridSize)}>Clear</button>
                <label id="midiOut-label" className="arrow-input-label">MIDI Output:</label>
                <select id="midiOut" className="arrow-input">
                    <option value="">Not connected</option>
                </select>
            </div>
        );
    }
}
