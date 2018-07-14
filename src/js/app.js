import React from 'react';
import {
    PlayButton,
    PauseButton,
    MuteToggleButton
} from 'react-player-controls';
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
import {TrashButton} from './buttons/trash-button';
import {EditButton} from './buttons/edit-button';
// import {EraseButton} from './buttons/erase-button';
import {ArrowButton} from './buttons/arrow-button';
import {SymmetryButton} from './buttons/symmetry-button';
import {PlusButton} from './buttons/plus-button';

// const chance = new Chance();
const maxSize = 20;
const minSize = 2;
const minNoteLength = 50;
const maxNoteLength = 500;
const interactSound = (note, state) => (state.muted ? undefined : makePizzaSound(note, 50).play());
export class Application extends React.Component {
    constructor(props) {
        super(props);

        const preset = JSON.parse('{"size":8,"arrows":[{"x":0,"y":3,"vector":3},{"x":0,"y":3,"vector":3},{"x":1,"y":2,"vector":0},{"x":1,"y":2,"vector":0},{"x":3,"y":4,"vector":2},{"x":3,"y":4,"vector":2},{"x":2,"y":3,"vector":3},{"x":2,"y":3,"vector":3},{"x":2,"y":3,"vector":3},{"x":2,"y":3,"vector":3},{"x":3,"y":6,"vector":0},{"x":3,"y":6,"vector":0},{"x":3,"y":6,"vector":1},{"x":3,"y":6,"vector":1}],"muted":false}');

        this.state = {
            gridSize: 8,
            inputDirection: 0,
            noteLength: 200,
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
        setUpCanvas(this.state, this.addToGrid);
    }

    componentDidMount() {
        // this.play();
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
        this.resetTimer();
        const input = parseInt(e.target.value, 10);
        this.setState({
            noteLength: input,
        });
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
            const symmetries = {
                horizontalSymmetry: this.state.horizontalSymmetry,
                verticalSymmetry: this.state.verticalSymmetry,
                backwardDiagonalSymmetry: this.state.backwardDiagonalSymmetry,
                forwardDiagonalSymmetry: this.state.forwardDiagonalSymmetry
            };
            this.setState({
                grid: addToGrid(this.state.grid, x, y, this.state.inputDirection, symmetries, this.state.inputNumber)
            });
        }
    }
    render() {
        const newDate = new Date();
        updateCanvas(this.state, newDate);
        return (
            <div className="no-copy midi-toys-app">

                <div className="edit-options">
                    <div className="edit-options-member">
                        <MuteToggleButton
                            isEnabled={true}
                            isMuted={this.state.muted}
                            onMuteChange={this.muteToggle}
                        />
                    </div>
                    <div className="edit-options-member">
                        {
                            this.state.playing ?
                                <PauseButton  onClick={this.pause}></PauseButton> :
                                <PlayButton isEnabled={true} onClick={this.play}></PlayButton>
                        }
                    </div>
                </div>
                <input id="max-note-length" className="arrow-input" type="range" max={maxNoteLength} min={minNoteLength} value={this.state.noteLength} onChange={this.newNoteLength} />
                <select id="midiOut" className="arrow-input">
                    <option value="">Not connected</option>
                </select>

                <div id="sketch-holder"/>
                <input
                    id="arrow-input-number"
                    className="arrow-input" 
                    type="range"
                    max={maxSize}
                    min={minSize}
                    value={this.state.gridSize}
                    onChange={this.newSize}
                />
                <SymmetryButton 
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
                />
                <PlusButton 
                    onClick={
                        ()=>this.setState({
                            inputNumber: ((this.state.inputNumber + 1) % 5) || 1
                        }
                    )}
                />
                {
                    [
                        (
                            <ArrowButton
                                number={this.state.inputNumber}
                                onClick={
                                    () => this.newInputDirection(1)
                                } 
                                direction="Up"
                            />),
                        (
                            <ArrowButton
                                number={this.state.inputNumber}
                                onClick={
                                    () => this.newInputDirection(2)
                                }
                                direction="Right"
                            />),
                        (
                            <ArrowButton
                                number={this.state.inputNumber}
                                onClick={
                                    () => this.newInputDirection(3)
                                }
                                direction="Down"
                            />),
                        (
                            <ArrowButton
                                number={this.state.inputNumber}
                                onClick={
                                    () => this.newInputDirection(0)
                                }
                                direction="Left"
                            />),
                    ][this.state.inputDirection]
                }
                <EditButton isEditing={!this.state.deleting} onClick={this.changeEditMode} className={this.state.deleting ? 'EraseIconRotate' : 'EditIconRotate'}/>
                <TrashButton onClick={() => this.newGrid(0, this.state.gridSize)}/>
            </div>
        );
    }
}
