import React from 'react';
import ReactDOM from 'react-dom';
import Chance from 'chance';
import * as R from 'ramda';
import Pizzicato from 'pizzicato';
import notesFrequencies from 'notes-frequencies';
import { release } from 'os';
import p5 from 'p5';

const chance = new Chance();
const NO_BOUNDARY = 'no-boundary';
const BOUNDARY = 'boundary';
export const vectors = [
  'arrow-up',
  'arrow-right',
  'arrow-down',
  'arrow-left'
];
export const vectorOperations = [
  ({x, y, vector})=>({x, y: y-1, vector}),
  ({x, y, vector})=>({x: x+1, y, vector}),
  ({x, y, vector})=>({x, y: y+1, vector}),
  ({x, y, vector})=>({x: x-1, y, vector})
];
export const getVector = () => chance.natural({
  min: 0,
  max: 3
});
export const cycleVector = (vector, number) => {
  return (vector + number - 1) % 4
};
export const getRandomNumber = (size) => chance.natural({
  min: 0,
  max: size - 1
});
export const getRows = size => R.range(0, size).map(() => R.range(0, size));
export const getArrow = size => () => ({
  x: getRandomNumber(size),
  y: getRandomNumber(size),
  vector: getVector()
});
export const removeFromGrid = (grid, x, y) => {
  const nextGrid = {
    ...grid,
    arrows: grid.arrows.filter(arrow => arrow.x !== x || arrow.y !== y)
  };
  return nextGrid;
};
export const addToGrid = (grid, x, y, dir) => {
  const nextGrid = {
    ...grid,
    arrows: [
      ...grid.arrows,
      {
        x,
        y,
        vector: dir
      }
    ]
  };
  return nextGrid;
};
export const newGrid = (size, numberOfArrows) => {
  const arrows = R.range(0, numberOfArrows).map(getArrow(size))

  return {size, arrows, muted: true};
};
export const seedGrid = () => newGrid(getRandomNumber(20)+12, getRandomNumber(50)+1);
export const moveArrow = arrow => vectorOperations[arrow.vector](arrow);
export const arrowKey = arrow => '{x:'+arrow.x+',y:'+arrow.y+',vector:'+arrow.vector+'}';
export const locationKey = arrow => '{x:'+arrow.x+',y:'+arrow.y+'}';
export const arrowBoundaryKey = (arrow, size)=> {
  if(arrow.y === 0 && arrow.vector === 0) {
    return BOUNDARY;
  }
  if(arrow.x === size - 1 && arrow.vector === 1) {
    return BOUNDARY;
  }
  if(arrow.y === size - 1 && arrow.vector === 2) {
    return BOUNDARY;
  }
  if(arrow.x === 0 && arrow.vector === 3) {
    return BOUNDARY;
  }
  return NO_BOUNDARY;
};
export const newArrayIfFalsey = thingToCheck => thingToCheck ? thingToCheck : [];
export const rotateArrow = number => arrow => ({
  ...arrow,
  vector: cycleVector(arrow.vector, number)
});
export const rotateSet = set => set.map(rotateArrow(set.length));
export const flipArrow = ({vector, ...rest}) => ({vector: (vector+2)%4, ...rest});
export const getArrowBoundaryDictionary = (arrows, size, keyFunc)=>{
  return arrows.reduce(
    (arrowDictionary, arrow) => {
      arrowDictionary[keyFunc(arrow, size)] = [
          ...(newArrayIfFalsey(arrowDictionary[keyFunc(arrow, size)])),
          arrow
      ];
      return arrowDictionary;
    }
    , {}
  );
}
function sound(src, speed) {
    const aSound = document.createElement("audio");
    aSound.src = src;
    aSound.setAttribute("preload", "auto");
    aSound.setAttribute("controls", "none");
    aSound.style.display = "none";
    aSound.setAttribute("playbackRate", speed);
    document.body.appendChild(aSound);
    return {
        play: function(){
            aSound.play();
            setTimeout(()=>document.body.removeChild(aSound), 500);
        }
    }
}
const getIndex = (x, y, size, vector) => {
    if(vector===1 ||vector===3){
        return y;
    }else if(vector===0 ||vector===2){
        return x
    }
    return 0;
}

const makeMIDImessage = (index, length) => {

  const midiKeyNumbers = [45, 47, 48, 50, 52, 54, 55, 57, 59, 61, 62, 64, 66, 67, 69, 71, 73, 74];
  const noteIndex = index%midiKeyNumbers.length;

  return {        
      play: function(){
          (midiOut||{send:()=>{}}).send(
            [
              0x90,
              midiKeyNumbers[noteIndex],
              0x40
            ]
          );
          setTimeout(()=>{
            const midcon = (midiOut||{send:()=>{}}).send(
              [
                0x80,
                midiKeyNumbers[noteIndex],
                0x00
              ]
            );
            
          }, length-1);
      }
  }
}
const makePizzaSound = (index, length) => {

    // const frequencies = notesFrequencies('D3 F3 G#3 C4 D#4 G4 A#5');
    const frequencies = notesFrequencies('A3 B3 C3 D3 E3 F3 G3 A4 B4 C4 D4 E4 F4 G4 A5 B5 C5 D5 E5 F5 G5');
    const noteIndex = index%frequencies.length;
    const aSound = new Pizzicato.Sound({ 
        source: 'wave', 
        options: {
            frequency: frequencies[noteIndex][0],
            attack: 0.1,
            release: 0.1,
            type:'triangle'
        }
    });
    var distortion = new Pizzicato.Effects.Distortion({
        gain: 0.8
    });
     
    aSound.addEffect(distortion);
    
    var reverb = new Pizzicato.Effects.Reverb({
        time: length/2.0,
        decay: length/2.0,
        reverse: true,
        mix: 0.7
    });
     
    aSound.addEffect(reverb);
    return {        
        play: function(){
            aSound.play();
            setTimeout(()=>{
              aSound.stop()
            }, length-1);
        }
    }
}
export const playSounds = (boundaryArrows, size, length, muted) => {
    boundaryArrows.map((arrow) => {
        const speed = getIndex(arrow.x, arrow.y, size, arrow.vector);

        if(!muted) {
          const snd = makePizzaSound(speed, length);
          snd.play();
        }
        
        const midiMessage = makeMIDImessage(speed, length);
        midiMessage.play();
    })
}
export const nextGrid = (grid, length) => {
  const size = grid.size;
  const arrows = grid.arrows;

  const arrowsWithVectorDictionary = getArrowBoundaryDictionary(arrows, size, arrowKey)
  const reducedArrows = Object.keys(arrowsWithVectorDictionary).reduce(
    (acc, arrowsWithSameVectorKey) => {
      const arrowsAtIndex = arrowsWithVectorDictionary[arrowsWithSameVectorKey];
      const reducedArrowsAtIndex = R.take(arrowsAtIndex.length%4||4,arrowsAtIndex);
      return [...acc,...reducedArrowsAtIndex];
    }
  , [])
  const arrowSetDictionary = getArrowBoundaryDictionary(reducedArrows, size, locationKey)

  const noisyArrowBoundaryDictionary = getArrowBoundaryDictionary(arrows, size, arrowBoundaryKey);
  playSounds(newArrayIfFalsey(noisyArrowBoundaryDictionary[BOUNDARY]), size, length, grid.muted);

  const arrowSets = Object.keys(arrowSetDictionary).map(key => arrowSetDictionary[key]);
  const rotatedArrows = arrowSets.map(rotateSet);
  const flatRotatedArrows = rotatedArrows.reduce((accum, current)=>[...accum, ...current],[]);

  const arrowBoundaryDictionary = getArrowBoundaryDictionary(flatRotatedArrows, size, arrowBoundaryKey);
  const movedArrowsInMiddle = newArrayIfFalsey(arrowBoundaryDictionary[NO_BOUNDARY]).map(moveArrow);
  const movedFlippedBoundaryArrows = newArrayIfFalsey(arrowBoundaryDictionary[BOUNDARY]).map(flipArrow).map(moveArrow);

  return {
      ...grid,
      size,
      arrows: [
          ...movedArrowsInMiddle,
          ...movedFlippedBoundaryArrows
      ]
  };
};

const nat = () => chance.natural({
  min: 0,
  max: 255
})
let stateDrawing = {
  grid: {
    arrows: [],
    size:1
  }
};
const gridCanvasSize = 180;
const gridCanvasBorderSize = 4;
const triangleDrawingArray = [
  (topLeft,cellSize,sketch)=>sketch.triangle(topLeft.x+(cellSize/2.0), topLeft.y,topLeft.x+cellSize, topLeft.y+cellSize,topLeft.x, topLeft.y+cellSize),
  (topLeft,cellSize,sketch)=>sketch.triangle(topLeft.x, topLeft.y,topLeft.x+cellSize, topLeft.y+(cellSize/2.0),topLeft.x, topLeft.y+cellSize),
  (topLeft,cellSize,sketch)=>sketch.triangle(topLeft.x, topLeft.y,topLeft.x+cellSize, topLeft.y,topLeft.x+(cellSize/2.0), topLeft.y+cellSize),
  (topLeft,cellSize,sketch)=>sketch.triangle(topLeft.x+cellSize, topLeft.y,topLeft.x+cellSize, topLeft.y+cellSize,topLeft.x, topLeft.y+(cellSize/2.0))
];
const triangleRotatingArray = [
  
  (cellSize,sketch,percentage)=>sketch.triangle(cellSize/2.0, -(cellSize*percentage), cellSize, cellSize-(cellSize*percentage),0, cellSize-(cellSize*percentage)),
  (cellSize,sketch,percentage)=>sketch.triangle(0+cellSize*percentage,cellSize-(cellSize*percentage),(cellSize/2)+(cellSize*percentage*1.5),0.5*cellSize*percentage,cellSize,cellSize),
  (cellSize,sketch,percentage)=>sketch.quad(0,cellSize,cellSize/2,cellSize*percentage,cellSize,cellSize,cellSize/2,cellSize+cellSize*percentage),
  (cellSize,sketch,percentage)=>sketch.triangle(0,cellSize,(cellSize/2)-(1.5*cellSize*percentage),0.5*cellSize*percentage,cellSize-(cellSize*percentage),cellSize-(cellSize*percentage)),
];
const translateAndRotate = (topLeft, sketch, vector, cellSize) => {
  const xShift = vector === 1 || vector === 2 ? cellSize : 0;
  const yShift = vector === 2 || vector === 3 ? cellSize : 0;
  sketch.translate(topLeft.x+xShift,topLeft.y+yShift);
  sketch.angleMode(sketch.DEGREES);
  sketch.rotate(90*vector);
};
const timeShift = ({x, y}, vector, shiftAmount) => {
  const shifted = [
    {x:x, y:y-shiftAmount},
    {x:x+shiftAmount, y:y},
    {x:x, y:y+shiftAmount},
    {x:x-shiftAmount, y:y},
  ];
  return shifted[vector];
};
let date = new Date();
let arrowAdder
var s = function( sketch ) {
  sketch.setup = function() {
    sketch.createCanvas(gridCanvasSize+gridCanvasBorderSize*2,gridCanvasSize+gridCanvasBorderSize*2).parent('sketch-holder').id('arrows-animation');
  };
  sketch.draw = function() {
    //draw background slash border
    sketch.background(
      255,255,255
    );
    //draw grid 
    sketch.strokeWeight(0);
    sketch.fill(
      0,0,0
    );
    sketch.rect(gridCanvasBorderSize,gridCanvasBorderSize,gridCanvasSize,gridCanvasSize);
    //draw arrows
    sketch.fill(
      255,255,255
    );
    const cellSize = (gridCanvasSize*1.0)/(1.0*stateDrawing.grid.size);
    const convertIndexToPixel = index => (index*cellSize)+gridCanvasBorderSize;
    const convertArrowToTopLeft = (xy) => ({x:convertIndexToPixel(xy.x), y:convertIndexToPixel(xy.y)});
    const timeDiff = new Date().getTime()-date.getTime();
    const percentage = (stateDrawing.playing?timeDiff:0)/(1.0*stateDrawing.noteLength);
    //non-rotated arrows

    const arrowLocationDictionary = getArrowBoundaryDictionary(stateDrawing.grid.arrows,stateDrawing.grid.size, locationKey);

    const arrowsToRotateDictionary = Object.keys(arrowLocationDictionary).reduce((acc, location)=>{
      return arrowLocationDictionary[location].length !== 1 ?
      {
        ...acc,
        [location]: arrowLocationDictionary[location]
       } :
      acc
    }, {});
    const arrowsToNotRotateDictionary = Object.keys(arrowLocationDictionary).reduce((acc, location)=>{
      return arrowLocationDictionary[location].length === 1 ?
      [
        ...acc,
        ...arrowLocationDictionary[location]
      ] :
      acc
    }, []);
    //non-wall Arrows


    const arrowDictionary = getArrowBoundaryDictionary(arrowsToNotRotateDictionary,stateDrawing.grid.size, arrowBoundaryKey);
    (arrowDictionary[NO_BOUNDARY]||[]).map((arrow)=>{
      const shiftedTopLeft = timeShift(convertArrowToTopLeft(arrow), arrow.vector, cellSize*percentage);
      const triangleDrawer = triangleDrawingArray[arrow.vector];
      triangleDrawer(shiftedTopLeft,cellSize,sketch);
    });
    //wall Arrows
    (arrowDictionary[BOUNDARY]||[]).map((arrow) => {
      sketch.push()
      sketch.strokeWeight(0);
      sketch.fill(
        255,255,255
      );
      const topLeft = convertArrowToTopLeft(arrow);
      translateAndRotate(topLeft, sketch, arrow.vector, cellSize);
      sketch.quad(0,cellSize,cellSize/2,cellSize*percentage,cellSize,cellSize,cellSize/2,cellSize+cellSize*percentage);
      sketch.pop()
    });
    //rotating Arrows
    Object.keys(arrowsToRotateDictionary).map((arrowsToRotateIndex) => {
      arrowsToRotateDictionary[arrowsToRotateIndex].map((arrow)=>{
        const topLeft = convertArrowToTopLeft(arrow);

        sketch.push()
        sketch.strokeWeight(0);
        sketch.fill(
          255,255,255
        );
        translateAndRotate(topLeft, sketch, arrow.vector, cellSize);

        triangleRotatingArray[(arrowsToRotateDictionary[arrowsToRotateIndex].length%4||4)-1](cellSize,sketch,percentage);

        sketch.pop()
      });
    });

    //draw hover input
    sketch.cursor(sketch.CROSS);
    const convertPixelToIndex = pixel => Math.floor((pixel-gridCanvasBorderSize)/cellSize);
    const mouseXindex = convertPixelToIndex(sketch.mouseX);
    const mouseYindex = convertPixelToIndex(sketch.mouseY);
    triangleDrawingArray[stateDrawing.inputDirection](convertArrowToTopLeft({x: mouseXindex, y:mouseYindex}), cellSize, sketch);

    sketch.touchEnded = function(e){
      if (sketch.mouseX>0+gridCanvasBorderSize&&
        sketch.mouseX<gridCanvasSize-gridCanvasBorderSize&&
        sketch.mouseY>0+gridCanvasBorderSize&&
        sketch.mouseY<gridCanvasSize-gridCanvasBorderSize
      ) {
        if(arrowAdder){
          arrowAdder(mouseXindex, mouseYindex, e);
          return false;
        }
      }else{
        console.log('click in the canvas please');
      }
    }
  };
};

const maxArrows=100;
const minArrows=0;
const maxSize=200;
const minSize=1;
const minNoteLength=1;
const maxNoteLength=5000;
const interactSound = (note, state) => state.muted ? undefined : makePizzaSound(note, 50).play();
export class Application extends React.Component { 

constructor(props) {
  super(props);

  this.state = {
    gridSize: 8,
    inputDirection: 0,
    noteLength: 150,
    numberOfArows: 0,
    grid: newGrid(8, 8),
    playing: true,
    muted: true
  }
  this.newSizeHandler = this.newSize.bind(this);
  this.newNoteLengthHandler = this.newNoteLength.bind(this);
  this.newNumberOfArrowsHandler = this.newNumberOfArrows.bind(this);
  this.nextGridHandler = this.nextGrid.bind(this);
  this.newGridHandler = this.newGrid.bind(this);
  this.playHandler = this.play.bind(this);
  this.pauseHandler = this.pause.bind(this);
  this.muteToggleHandler = this.muteToggle.bind(this);
  this.addToGridHandler = this.addToGrid.bind(this);
  arrowAdder = this.addToGridHandler ;
  this.newInputDirectionHandler = this.newInputDirection.bind(this);
}

componentDidMount() {
  this.playHandler();
}
play() {
  this.timerID = setInterval(
    () => this.nextGridHandler(this.state.noteLength),
    this.state.noteLength
  );
  this.setState({playing: true});
  interactSound(6,this.state);
}
pause() {
  clearInterval(this.timerID);
  this.setState({playing:false});
  interactSound(5,this.state);
}
muteToggle() {
  this.setState({muted: !this.state.muted});
  interactSound(1,this.state);
}
newSize(e) {
  let input = parseInt(e.target.value);
  if (isNaN(input)) {
    input = 8;
  }else if(input > maxSize){
    input = maxArrows;
  }else if(input < minSize){
    input = minArrows;
  }
  this.setState({
    gridSize: input,
    grid: {
      ...this.state.grid,
      size: input
    }
  });
  interactSound(2,this.state);
}
newNoteLength(e) {
  clearInterval(this.timerID);
  let input = parseInt(e.target.value);
  if (isNaN(input)) {
    input = 150;
  }else if(input > maxNoteLength){
    input = maxNoteLength;
  }else if(input < minNoteLength){
    input = minNoteLength;
  }
  this.setState({
    noteLength: input
  });
    this.play();
    interactSound(3,this.state);
}
newNumberOfArrows(e) {
  let input = parseInt(e.target.value);
  if (isNaN(input)) {
    input = 8;
  }else if(input > maxArrows){
    input = maxArrows;
  }else if(input < minArrows){
    input = minArrows;
  }
  this.setState({
    numberOfArows: input
  });
  // this.newGridHandler(input, this.state.gridSize)
  interactSound(4,this.state);
}
nextGrid(length) {
  date = new Date();
  this.setState({
    grid: nextGrid({...this.state.grid, muted: this.state.muted}, length)
  })
}
newInputDirection(inputDirection) {
  this.setState({
    inputDirection
  })
}
newGrid(number, size) {
  this.setState({
    grid: newGrid(size, number)
  })
}
addToGrid(x, y, e) {
  
  if (e.shiftKey) {
    this.setState({
      grid: removeFromGrid(this.state.grid, x, y)
    }) 
  }
  else {
    this.setState({
      grid: addToGrid(this.state.grid, x, y, this.state.inputDirection)
    }) 
  }

}
render() {
  stateDrawing = this.state;
  return(
  <div className="midi-toys-app">
    <label className='arrow-input-label'>{'Sound:'}</label>
    <button className='arrow-input'  onClick={this.muteToggleHandler}>{this.state.muted ? 'Turn Sound On' : 'Turn Sound Off'}</button>
    <label className='arrow-input-label'>{'Clear:'}</label>
    <button className='arrow-input'  onClick={()=>this.newGridHandler(this.state.numberOfArows, this.state.gridSize)}>{'Clear'}</button>
    <label className='arrow-input-label'>{'Time per Step:'}</label>
    <input className='arrow-input' type='number' max={maxNoteLength} min={minNoteLength} value={this.state.noteLength} onChange={this.newNoteLengthHandler}/>
    {/* <label className='arrow-input-label'>{'Number of Arrows:'}</label> */}
    {/* <input className='arrow-input' type='number' max={maxArrows} min={minArrows} value={this.state.numberOfArows} onChange={this.newNumberOfArrowsHandler}/> */}
    <label className='arrow-input-label'>{'Size of Grid:'}</label>
    <input className='arrow-input' type='number' max={maxSize} min={minSize} value={this.state.gridSize} onChange={this.newSizeHandler}/>
    <label className='arrow-input-label'>{'Arrow Direction:'}</label>
    {
      [
        (<button className='arrow-input' onClick={()=>this.newInputDirectionHandler(1)}>{'Up'}</button>),
        (<button className='arrow-input' onClick={()=>this.newInputDirectionHandler(2)}>{'Right'}</button>),
        (<button className='arrow-input' onClick={()=>this.newInputDirectionHandler(3)}>{'Down'}</button>),
        (<button className='arrow-input' onClick={()=>this.newInputDirectionHandler(0)}>{'Left'}</button>),
      ] 
      [this.state.inputDirection] 
    }
    <label className='arrow-input-label'>{'Start/Stop:'}</label>
    {
      this.state.playing ? 
        <button className='arrow-input' onClick={this.pauseHandler}>{'Stop'}</button> :
        <button className='arrow-input' onClick={this.playHandler}>{'Start'}</button>
    }
    <label className='arrow-input-label'>{'CLICK to place an arrow'}</label>
    <label className='arrow-input-label'>{'SHIFT + CLICK to clear a square'}</label>
      <div id="sketch-holder">
      </div>
    <label className='arrow-input-label'>{'MIDI Output:'}</label>
		<select id='midiOut' className='arrow-input' onchange='changeMidiOut();'>
			<option value="">Not connected</option>
		</select>
</div>
)};
}

function onMIDIFail( err ) {
	alert("MIDI initialization failed.");
}

let selectMIDIOut = null;
let midiAccess = null;
let midiIn = null;
let midiOut = null;
let launchpadFound = false;

function changeMIDIOut( ev ) {
    
  try{
    var selectedID = selectMIDIOut[selectMIDIOut.selectedIndex].value;

    for (var output of midiAccess.outputs.values()) {
      if (selectedID == output.id) {
        midiOut = output;
        return
      }
    }
    midiOut = null;
  }
  catch(err){
    console.log('MIDI is not supported by your browser access');
  }
}
function onMIDIInit( midi ) {
  midiAccess = midi;
  selectMIDIOut=document.getElementById("midiOut");

  // clear the MIDI output select
  selectMIDIOut.options.length = 0;
  selectMIDIOut.add(new Option('Select Device',undefined,false,false));
  for (var output of midiAccess.outputs.values()) {
    	selectMIDIOut.add(new Option(output.name,output.id,false,false));
  }
  selectMIDIOut.onchange = changeMIDIOut;

}

try{
  navigator.requestMIDIAccess({}).then( onMIDIInit, onMIDIFail )
}
catch(err){
  console.log('MIDI is not supported by your browser access ');
}
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
      "type": "square",
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
        "speed": .5,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 10,
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
      "width": 2.425800503471389
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

ReactDOM.render(<Application/>, document.getElementById('root'));

new p5(s);
