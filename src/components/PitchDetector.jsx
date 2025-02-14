import React, { useEffect, useState } from 'react';
import Pitchfinder from 'pitchfinder';
import PropTypes from 'prop-types';

const scales = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const PitchDetector = ({ isTuning, isPlaying, expectedNote }) => {
  const [audioContext, setAudioContext] = useState(null);
  const [microphoneStream, setMicrophoneStream] = useState(null);
  const [detectedPitch, setDetectedPitch] = useState('-');
  const [currentVolume, setCurrentVolume] = useState('-');

  useEffect(() => {
    if (isTuning || isPlaying) {
      startTuning();
    } else {
      stopTuning();
    }
    return () => stopTuning();
  }, [isTuning, isPlaying]);

  const startTuning = async () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(audioCtx);

      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicrophoneStream(micStream);

      const detectPitch = Pitchfinder.YIN({ sampleRate: audioCtx.sampleRate });

      const sourceNode = audioCtx.createMediaStreamSource(micStream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      sourceNode.connect(analyser);

      const volumeMeter = new Uint8Array(analyser.frequencyBinCount);

      const updatePitch = () => {
        if (!analyser) return;

        analyser.getByteFrequencyData(volumeMeter);
        const volume = Math.max(...volumeMeter) / 255;
        setCurrentVolume((volume * 100).toFixed(0));

        const floatBuffer = new Float32Array(analyser.fftSize);
        analyser.getFloatTimeDomainData(floatBuffer);
        const frequency = detectPitch(floatBuffer);

        if (frequency) {
          const midiNumber = frequencyToMidi(frequency);
          setDetectedPitch(midiToNote(midiNumber));
        } else {
          setDetectedPitch('-');
        }

        requestAnimationFrame(updatePitch);
      };

      updatePitch();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setDetectedPitch('-');
      setCurrentVolume('-');
    }
  };

  const stopTuning = () => {
    if (microphoneStream) {
      microphoneStream.getTracks().forEach(track => track.stop());
      setMicrophoneStream(null);
    }
    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close();
      setAudioContext(null);
    }
    setDetectedPitch('-');
    setCurrentVolume('-');
  };

  const frequencyToMidi = (freq) => {
    return Math.round(12 * (Math.log2(freq / 440)) + 69);
  };

  const midiToNote = (midiNumber) => {
    if (midiNumber < 0 || midiNumber > 127) return '-';
    const octave = Math.floor(midiNumber / 12) - 1;
    const note = scales[midiNumber % 12];
    return `${note}${octave}`;
  };

  return (
    <h2 id="pitch">
      {expectedNote} / {detectedPitch} / {currentVolume} {currentVolume > 0 && '%'}
    </h2>
  );
};

PitchDetector.propTypes = {
  isTuning: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  expectedNote: PropTypes.string.isRequired,
};

export default PitchDetector;
