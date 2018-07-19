
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
    // const frequencies = notesFrequencies('D3 F3 G#3 C4 D#4 G4 A#5');
    const frequencies = notesFrequencies('A3 B3 C3 D3 E3 F3 G3 A4 B4 C4 D4 E4 F4 G4 A5 B5 C5 D5 E5 F5 G5');
    const noteIndex = index % frequencies.length;
    const aSound = new Pizzicato.Sound({
        source: 'wave',
        options: {
            frequency: frequencies[noteIndex][0],
            attack: 0.1,
            release: 0.1,
            type: 'sawtooth',
        },
    });
    // const reverb = new Pizzicato.Effects.Reverb({
    //     time: length / 2.0,
    //     decay: length / 2.0,
    //     reverse: true,
    //     mix: 0.7,
    // });

    // aSound.addEffect(reverb);
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
