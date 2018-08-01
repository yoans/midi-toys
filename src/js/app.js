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
    emptyGrid,
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
import presets from './presets';

const chance = new Chance();
const maxSize = 20;
const minSize = 2;
const minNoteLength = -500;
const maxNoteLength = -50;
const sound = ({
    play:()=>{
        const theSound = makePizzaSound(1);
        theSound.play();
        setTimeout(
            ()=>{theSound.stop()},
            1
        )
    }
});
const interactSound = (state) => (state.muted ? undefined : sound.play());
const putArrowsInGrid = (arrows) => ({"size":8,"arrows":arrows,"muted":true});
export class Application extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPreset:-1,
            presets,
            inputDirection: 0,
            noteLength: props.noteLength || 275,
            grid: props.grid || newGrid(11, 0),
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
        this.setState({ muted: !this.state.muted });
        interactSound(this.state);
    }
    changeEditMode = () => {
        this.setState({ deleting: !this.state.deleting });
    }
    newSize = (value) => {
        const input = parseInt(value, 10);

        this.setState({
            grid: {
                ...this.state.grid,
                id: chance.guid(),
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
            grid: nextGrid({
                ...this.state.grid,
                id: chance.guid(),
                muted: this.state.muted 
            }, length),
        });
    }
    newInputDirection = (inputDirection) => {
        this.setState({
            inputDirection,
        });
    }
    newGrid = (number, size) => {
        this.setState({
            grid: newGrid(size, number),
        });
    }
    emptyGrid = () => {
        this.setState({
            grid: emptyGrid(this.state.grid.size),
        });
    }
    addPreset = () => {
        
        const encoded = window.btoa(
            JSON.stringify({
                noteLength:this.state.noteLength,
                grid: this.state.grid
            })
        );
        console.log(encoded);
        // this.setState({
        //     presets: [
        //         ...this.state.presets,
        //         putArrowsInGrid(
        //             this.state.grid.arrows
        //         )
        //     ]
        // });
    }
    addToGrid = (x, y, e) => {
        if (e.shiftKey || this.state.deleting) {
            this.setState({
                grid: removeFromGrid(this.state.grid, x, y)
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
                <div className="app-title-div">
                    <h1 data-step="1" data-intro="Welcome to Arrowgrid!">
                        Arrowgrid
                    </h1>
                    <button
                        onClick={()=>{introJs().start()}}
                    >
                        Tutorial
                    </button>
                </div>
                <div className="edit-options">
                    {/*<PlusButton 
                        onClick={this.addPreset}
                    /> */}
                    <div className="edit-options-member">
                    {/* <PlusButton 
                        onClick={this.addPreset}
                    /> */}
                        <PrevButton
                            onClick={()=>{
                                let NextPreset = this.state.currentPreset - 1;
                                
                                if (NextPreset<0) {
                                    NextPreset = this.state.presets.length -1;
                                }

                                this.setState({
                                    grid: this.state.presets[NextPreset],
                                    currentPreset: NextPreset
                                });
                            }}
                            isEnabled={true}
                        />
                    </div> 
                    <div
                        className="edit-options-member"
                        data-step="14"
                        data-intro="Turn on sound to hear your creation."
                    >
                        <MuteToggleButton
                            isEnabled={true}
                            isMuted={this.state.muted}
                            onMuteChange={this.muteToggle}
                        />
                    </div>
                    <div
                        className="edit-options-member"
                        data-step="3"
                        data-intro="Press play to watch your creation unfold."
                    >
                        <div
                            data-step="7"
                            data-intro="Pause to erase arrows with ease."
                        >
                        <div
                            data-step="15"
                            data-intro="Make sure your device has sound enabled, and play your music."
                        >
                            {
                                this.state.playing ?
                                <PauseButton  onClick={this.pause}></PauseButton> :
                                <PlayButton isEnabled={true} onClick={this.play}></PlayButton>
                            }
                            </div>
                        </div>
                    </div>
                    <div
                        className="edit-options-member" 
                        data-step="4"
                        data-intro="Press this to see other examples."
                    >
                        <NextButton
                            onClick={()=>{
                                let NextPreset = this.state.currentPreset + 1;
                                
                                if (NextPreset>=this.state.presets.length) {
                                    NextPreset = 0;
                                }

                                this.setState({
                                    grid: this.state.presets[NextPreset],
                                    currentPreset: NextPreset
                                });
                            }}
                            isEnabled={true}
                        />
                    </div>
                </div>
            
                <div
                    className="edit-options"
                >
                    <div
                        className="edit-options-member"
                    >
                        <div
                            className="slider-container"
                            data-step="5"
                            data-intro="Adjust the speed with this slider."
                        >
                            <input
                                id="note-length-slider"
                                className="arrow-input"
                                type="range"
                                max={maxNoteLength}
                                min={minNoteLength}
                                value={-1*this.state.noteLength}
                            />
                        </div>
                        <div
                            className="slider-icon-container"
                        >
                            <RabbitIcon/>
                            <TurtleIcon/>
                        </div>
                    </div>
                </div>
                <div
                    className="edit-options"
                >
                    <div
                        className="edit-options-member"
                        data-step="13"
                        data-intro="Get Creative!"
                    >
                        <div
                            className="edit-options-member"
                            data-step="8"
                            data-intro="Delete some arrows by clicking on them."
                        >
                            <div
                                id="sketch-holder"
                                data-step="2"
                                data-intro="click on the grid to add an Arrow."
                            />
                        </div>
                    </div>
                </div>
                <div
                    className="edit-options"
                >
                    <div
                        className="edit-options-member"
                    >
                        <div
                            className="slider-container"
                            data-step="12"
                            data-intro="Add or remove space with this slider."
                        >
                            <input
                                id="grid-size-slider"
                                className="arrow-input" 
                                type="range"
                                max={maxSize}
                                min={minSize}
                                value={this.state.grid.size}
                            />
                        </div>
                        <div className="slider-icon-container">
                            <LargeGridIcon/>
                            <SmallGridIcon/>
                        </div>
                    
                    </div>
                </div>
                <div className="edit-options">
                    {/* <SymmetryButton 
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
                    /> */}
                    <div 
                        className="edit-options-member"
                        data-step="11"
                        data-intro="Change the arrow direction."
                    >
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
                    }</div>
                    {/* <PlusButton 
                        onClick={
                            ()=>this.setState({
                                inputNumber: ((this.state.inputNumber + 1) % 5) || 1
                            }
                        )}
                    /> */}
                    <div
                        className="edit-options-member"
                        data-step="6"
                        data-intro="Switch to erase mode."
                    >
                        <div 
                            data-step="10"
                            data-intro="Switch to draw mode."
                        >
                            <EditButton isEditing={!this.state.deleting} onClick={this.changeEditMode} className={this.state.deleting ? 'EraseIconRotate' : 'EditIconRotate'}/>
                        </div>
                    </div>
                    <div
                        className="edit-options-member"
                        data-step="9"
                        data-intro="Trash the whole thing if you like."
                    >
                        <TrashButton onClick={this.emptyGrid}/>
                    </div>
                </div>
                <select id="midiOut" className="arrow-input">
                    <option value="">Not connected</option>
                </select>
            </div>
        );
    }
}
