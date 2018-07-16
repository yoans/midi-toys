import React from 'react';
import {
    PlayButton,
    PauseButton,
    MuteToggleButton,
    PrevButton,
    NextButton
 
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
import {
    LargeGridIcon,
    SmallGridIcon,
    RabbitIcon,
    TurtleIcon
} from './buttons/icons';
import {setSliderOnChange} from './sliders';
import presets from '../assets/presets';

// const chance = new Chance();
const maxSize = 20;
const minSize = 2;
const minNoteLength = -500;
const maxNoteLength = -50;
const interactSound = (note, state) => (state.muted ? undefined : makePizzaSound(note, 50).play());
export class Application extends React.Component {
    constructor(props) {
        super(props);

        // const preset = JSON.parse('{"size":8,"arrows":[{"x":4,"y":4,"vector":1},{"x":4,"y":4,"vector":1},{"x":4,"y":4,"vector":1},{"x":3,"y":3,"vector":0},{"x":3,"y":3,"vector":0},{"x":3,"y":3,"vector":0},{"x":4,"y":4,"vector":2},{"x":4,"y":4,"vector":2},{"x":4,"y":4,"vector":2},{"x":3,"y":3,"vector":3},{"x":3,"y":3,"vector":3},{"x":3,"y":3,"vector":3},{"x":5,"y":5,"vector":2},{"x":5,"y":5,"vector":2},{"x":5,"y":5,"vector":2},{"x":5,"y":5,"vector":3},{"x":5,"y":5,"vector":3},{"x":5,"y":5,"vector":3},{"x":2,"y":2,"vector":0},{"x":2,"y":2,"vector":0},{"x":2,"y":2,"vector":0},{"x":2,"y":2,"vector":1},{"x":2,"y":2,"vector":1},{"x":2,"y":2,"vector":1},{"x":4,"y":3,"vector":1},{"x":4,"y":3,"vector":1},{"x":4,"y":3,"vector":1},{"x":3,"y":4,"vector":2},{"x":3,"y":4,"vector":2},{"x":3,"y":4,"vector":2},{"x":4,"y":3,"vector":0},{"x":4,"y":3,"vector":0},{"x":4,"y":3,"vector":0},{"x":3,"y":4,"vector":3},{"x":3,"y":4,"vector":3},{"x":3,"y":4,"vector":3},{"x":5,"y":2,"vector":1},{"x":5,"y":2,"vector":1},{"x":5,"y":2,"vector":1},{"x":5,"y":2,"vector":2},{"x":5,"y":2,"vector":2},{"x":5,"y":2,"vector":2},{"x":2,"y":5,"vector":0},{"x":2,"y":5,"vector":0},{"x":2,"y":5,"vector":0},{"x":2,"y":5,"vector":3},{"x":2,"y":5,"vector":3},{"x":2,"y":5,"vector":3}],"muted":true}');
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
        setUpCanvas(this.state, this.addToGrid);
    }

    componentDidMount() {
        // this.play();
        const idsAndCallbacks = [
            {id: '#grid-size-slider', onChange: this.newSize},
            {id: '#note-length-slider', onChange: this.newNoteLength}
        ]
        setSliderOnChange(idsAndCallbacks);
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
    newSize = (value) => {
        this.resetTimer();
        const input = parseInt(value, 10);

        this.setState({
            gridSize: input,
            grid: {
                ...this.state.grid,
                size: input,
            },
        });
    }
    newNoteLength = (value) => {
        this.resetTimer();
        const input = parseInt(value, 10);

        this.setState({
            noteLength: -1*input,
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
                        <PrevButton onClick={()=>{}} isEnabled={true} />
                    </div>
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
                    <div className="edit-options-member">
                        <NextButton onClick={()=>{}} isEnabled={true} />
                    </div>
                </div>
                <div className="slider-container">
                    <input
                        id="note-length-slider"
                        className="arrow-input"
                        type="range"
                        max={maxNoteLength}
                        min={minNoteLength}
                        value={-1*this.state.noteLength}
                    />
                </div>
                <div className="slider-icon-container">
                    <RabbitIcon/>
                    <TurtleIcon/>
                </div>
                <div id="sketch-holder"/>
                <div className="slider-container">
                    <input
                        id="grid-size-slider"
                        className="arrow-input" 
                        type="range"
                        max={maxSize}
                        min={minSize}
                        value={this.state.gridSize}
                    />
                </div>
                <div className="slider-icon-container">
                    <LargeGridIcon/>
                    <SmallGridIcon/>
                </div>
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
                <PlusButton 
                    onClick={
                        ()=>this.setState({
                            inputNumber: ((this.state.inputNumber + 1) % 5) || 1
                        }
                    )}
                />
                <EditButton isEditing={!this.state.deleting} onClick={this.changeEditMode} className={this.state.deleting ? 'EraseIconRotate' : 'EditIconRotate'}/>
                <TrashButton onClick={() => this.newGrid(0, this.state.gridSize)}/>
                <select id="midiOut" className="arrow-input">
                    <option value="">Not connected</option>
                </select>
            </div>
        );
    }
}
