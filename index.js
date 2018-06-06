import React from 'react';
import ReactDOM from 'react-dom';
import Chance from 'chance';
import * as R from 'ramda';
import Pizzicato from 'pizzicato';
import notesFrequencies from 'notes-frequencies';
import { release } from 'os';

const chance = new Chance();
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
export const arrowKey = arrow => '{x:'+arrow.x+',y:'+arrow.y+'}';
export const arrowBoundaryKey = (arrow, size)=> {
  if(arrow.y === 0 && arrow.vector === 0) {
    return 'boundary';
  }
  if(arrow.x === size - 1 && arrow.vector === 1) {
    return 'boundary';
  }
  if(arrow.y === size - 1 && arrow.vector === 2) {
    return 'boundary';
  }
  if(arrow.x === 0 && arrow.vector === 3) {
    return 'boundary';
  }
  return 'no-boundary';
};
export const newArrayIfFalsey = thingToCheck => thingToCheck ? thingToCheck : [];
export const rotateArrow = number => arrow => ({
  ...arrow,
  vector: cycleVector(arrow.vector, number)
});
export const rotateSet = set => set.map(rotateArrow(set.length));
export const flipArrow = ({vector, ...rest}) => ({vector: (vector+2)%4, ...rest});

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
const reduceArrowNumber = x=>x;//(arrowSet)=>R.take(arrowSet.length%4, arrowSet);//This has the side effect of destroying arrows that don't have the same vector
export const nextGrid = (grid, length) => {
  const size = grid.size;
  const arrows = grid.arrows;

  const arrowSetDictionary = arrows.reduce(
      (arrowDictionary, arrow) => {
        arrowDictionary[arrowKey(arrow)] = [
          ...(newArrayIfFalsey(arrowDictionary[arrowKey(arrow)])),
          arrow
        ];
        return arrowDictionary;
      }
  ,{});

    const noisyArrowBoundaryDictionary = arrows.reduce(
        (arrowDictionary, arrow) => {
        arrowDictionary[arrowBoundaryKey(arrow, size)] = [
            ...(newArrayIfFalsey(arrowDictionary[arrowBoundaryKey(arrow, size)])),
            arrow
        ];
        return arrowDictionary;
        }
        ,{}
    );
    playSounds(newArrayIfFalsey(noisyArrowBoundaryDictionary['boundary']), size, length, grid.muted);

    const arrowSets = Object.keys(arrowSetDictionary).map(key => arrowSetDictionary[key]);
    const rotatedArrows = arrowSets.map(reduceArrowNumber).map(rotateSet);
    const flatRotatedArrows = rotatedArrows.reduce((accum, current)=>[...accum, ...current],[]);

    const arrowBoundaryDictionary = flatRotatedArrows.reduce(
        (arrowDictionary, arrow) => {
        arrowDictionary[arrowBoundaryKey(arrow, size)] = [
            ...(newArrayIfFalsey(arrowDictionary[arrowBoundaryKey(arrow, size)])),
            arrow
        ];
        return arrowDictionary;
        }
        ,{}
    );
    const movedArrowsInMiddle = newArrayIfFalsey(arrowBoundaryDictionary['no-boundary']).map(moveArrow);
    const movedFlippedBoundaryArrows = newArrayIfFalsey(arrowBoundaryDictionary['boundary']).map(flipArrow).map(moveArrow);

    

    return {
        ...grid,
        size,
        arrows: [
            ...movedArrowsInMiddle,
            ...movedFlippedBoundaryArrows
        ]
    };
};

const renderItem = (item) => {
  const classes = R.uniqBy(x=>x.vector, item).map(({vector})=>vectors[vector]);
if(item.length){
  return (
    <td>
      <div className={'space'} onClick={item.spawn}>
        {
          classes.map(divClass=>(<div className={divClass}/>))
        }
      </div>
    </td>
  )
}
return (
  <td>
    <div className={'space'} onClick={item.spawn}>
    </div>
  </td>
  )
};

const renderRow = (row) => {
  return (
    <tr key={chance.guid()}>
      {row.map(renderItem)}
    </tr>
  )
};
const renderGrid = (grid, spawnArrowFunction) => {
  
  const populateArrow = y => x => grid.arrows.filter(arrow => arrow.x===x && arrow.y===y);
  const populateRow = (row, index) => row.map(populateArrow(index));

  const populatedGrid = getRows(grid.size).map(populateRow);
  const addSpawnArrowToItem = y => (item, x) => Object.assign([...item], {spawn: (e)=>spawnArrowFunction(x, y, e)});
  const addSpawnArrowsToRow = (row, index) => row.map(addSpawnArrowToItem(index))
  const populatedLivingGrid = populatedGrid.map(addSpawnArrowsToRow)
  return populatedLivingGrid.map(renderRow);
};

const maxArrows=50;
const minArrows=0;
const maxSize=30;
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
    numberOfArows: 8,
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
  
  return(
  <div className="midi-toys-app">
    <label className='arrow-input-label'>{'Sound:'}</label>
    <button className='arrow-input'  onClick={this.muteToggleHandler}>{this.state.muted ? 'Turn Sound On' : 'Turn Sound Off'}</button>
    <label className='arrow-input-label'>{'Reset:'}</label>
    <button className='arrow-input'  onClick={()=>this.newGridHandler(this.state.numberOfArows, this.state.gridSize)}>{'Reset'}</button>
    <label className='arrow-input-label'>{'Time per Step:'}</label>
    <input className='arrow-input' type='number' max={maxNoteLength} min={minNoteLength} value={this.state.noteLength} onChange={this.newNoteLengthHandler}/>
    <label className='arrow-input-label'>{'Number of Arrows:'}</label>
    <input className='arrow-input' type='number' max={maxArrows} min={minArrows} value={this.state.numberOfArows} onChange={this.newNumberOfArrowsHandler}/>
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
      <table align="center">
        <tbody>
          {renderGrid(this.state.grid, this.addToGridHandler)}
        </tbody>
        
      </table>
    
    <label className='arrow-input-label'>{'MIDI Output:'}</label>
		<select id='midiOut' className='arrow-input' onchange='changeMidiOut();'>
			<option value="">Not connected</option>
		</select>

    {/* <label className='arrow-input-label'>{'MIDI Output:'}</label>
    <div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Select Output
  </button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <a class="dropdown-item" href="#">Action</a>
    <a class="dropdown-item" href="#">Another action</a>
    <a class="dropdown-item" href="#">Something else here</a>
  </div>
</div> */}

    <label className='arrow-input-label'>{'Learn how to create a virtual midi bus:'}</label>
    <a href="http://www.tobias-erichsen.de/software/loopmidi.html" target="_blank" className="aButton">
        Windows
    </a>
    <a href="https://help.ableton.com/hc/en-us/articles/209774225-Using-virtual-MIDI-buses" target="_blank" className="aButton">
        Mac
    </a>
    <a href= 'credits.html' target="_blank" className='aButton'>
      Credits
    </a>

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
  var selectedID = selectMIDIOut[selectMIDIOut.selectedIndex].value;

  for (var output of midiAccess.outputs.values()) {
    if (selectedID == output.id) {
      midiOut = output;
      return
  	}
  }
  midiOut = null;
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


navigator.requestMIDIAccess({}).then( onMIDIInit, onMIDIFail );

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

ReactDOM.render(<Application/>, document.getElementById('root'));

