
import Pizzicato from 'pizzicato';
import notesFrequencies from 'notes-frequencies';
import {makeMIDImessage} from './midi';

const getIndex = (x, y, size, vector) => {
    if (vector === 1 || vector === 3) {
        return y;
    } else if (vector === 0 || vector === 2) {
        return x;
    }
    return 0;
};

export const makePizzaSound = (index, length) => {
    //cacheSounds!
    
    
    // const frequencies = notesFrequencies('D3 F3 G#3 C4 D#4 G4 A#5');
    const frequencies = notesFrequencies('A3 B3 C3 D3 E3 F3 G3 A4 B4 C4 D4 E4 F4 G4 A5 B5 C5 D5 E5 F5 G5');
    const noteIndex = index % frequencies.length;
    const aSound = new Pizzicato.Sound({
        source: 'wave',
        options: {
            frequency: frequencies[noteIndex][0],
            attack: 0.01,
            release: 0.04,
            type: 'sine',
        },
    });
    // const reverb = new Pizzicato.Effects.Reverb({
    //     time: length / 2.0,
    //     decay: length / 2.0,
    //     reverse: true,
    //     mix: 0.7,
    // });
    var dubDelay = new Pizzicato.Effects.DubDelay({
        feedback: 0.4,
        time: 0.2,
        mix: 1,
        cutoff: 2400
    });
    var lowPassFilter = new Pizzicato.Effects.LowPassFilter({
        frequency: 1600,
        peak: 10
    });
    // sound.addEffect(dubDelay);
    // sound.play();
    // aSound.addEffect(reverb);
    // aSound.addEffect(reverb);
    // var pingPongDelay = new Pizzicato.Effects.PingPongDelay({
    //     feedback: 0.6,
    //     time: 0.4,
    //     mix: 0.5
    // });
    
    // sound.addEffect(pingPongDelay);
    // sound.play();
    
    aSound.addEffect(dubDelay);
    aSound.addEffect(lowPassFilter);
    return {
        play() {
            aSound.play();
            setTimeout(() => {
                aSound.stop();
            }, length - 1);
        },
    };
};
export const playSounds = (boundaryArrows, size, length, muted) => {
    const alreadyPlayedMap = {};
    boundaryArrows.map((arrow) => {
        const speed = getIndex(arrow.x, arrow.y, size, arrow.vector);

        if (!muted && !alreadyPlayedMap[speed]) {
            alreadyPlayedMap[speed] = [speed];
            const snd = makePizzaSound(speed, length);
            snd.play();
        }
        makeMIDImessage(speed, length).play();
        return undefined;
    });
};
