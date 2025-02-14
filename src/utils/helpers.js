import ABCJS from 'abcjs';

//helper functions to start, stop, and reset the playback of the ABC notation
//makes the code more readable and reusable

let audioContext = null;
let synth = null;
let timer = null;

const NOTE_COLOR_DEFAULT = '#6a7282';
const NOTE_COLOR_PLAYING = '#3D9AFC';
const scales = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export async function start(visualObj, tempo, onNoteChange) {
    if (!visualObj) {
        console.error("No visual object to play.");
        return;
    }

    if (synth) stop(); // Stop any existing playback before starting again

    // Create or resume 
    if (!audioContext || audioContext.state === 'closed') {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (audioContext.state === 'suspended') {
        await audioContext.resume();
    }

    synth = new ABCJS.synth.CreateSynth();

    try {
        await synth.init({
            visualObj: visualObj,
            audioContext: audioContext,
            millisecondsPerMeasure: (60000 / tempo) * 4,
            options: {
                pan: [0], // Centered audio
            }
        });

        await synth.prime();
        synth.start();

        timer = new ABCJS.TimingCallbacks(visualObj, {
            qpm: tempo,
            eventCallback: (event) => {
                resetNoteColors(false);
                if (event && event.elements) {
                    colorNotes(event.elements, NOTE_COLOR_PLAYING);
                    const midiPitch = event.midiPitches?.[0]?.pitch || 0;
                    onNoteChange(midiToNote(midiPitch));
                }
            },
        });

        timer.start();
    } catch (error) {
        console.error("Error initializing ABCJS synth:", error);
    }
}

export function stop() {
    if (timer) timer.stop();
    if (synth) synth.stop();
    if (audioContext) audioContext.close();
    resetNoteColors(true);
    timer = null;
    synth = null;
    audioContext = null;
}

export function reset(visualObj, tempo, onNoteChange) {
    stop();
    start(visualObj, tempo, onNoteChange);
}

function resetNoteColors(stop) {
    document.querySelectorAll('.abcjs-note').forEach((note) => {
        note.setAttribute('fill', stop ? NOTE_COLOR_DEFAULT : '#000000');
    });
}

function colorNotes(elements, color) {
    elements.forEach((elementGroup) => {
        elementGroup.forEach((element) => {
            element.setAttribute('fill', color);
        });
    });
}

function midiToNote(midiNumber) {
    if (midiNumber < 0 || midiNumber > 127) return '-';
    const octave = Math.floor(midiNumber / 12) - 1;
    const note = scales[midiNumber % 12];
    return `${note}${octave}`;
}
