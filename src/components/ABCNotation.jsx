import React, { useEffect, useState } from 'react';
import ABCJS from 'abcjs';
import PropTypes from 'prop-types';
import PitchDetector from './PitchDetector';
import { start, stop } from '../utils/helpers';

const DEFAULT_TEMPO = 60;

const ABCNotation = ({ file, isTuning, isPlaying, tempo }) => {
  const [abcContent, setAbcContent] = useState('');
  const [visualObj, setVisualObj] = useState(null);
  const [extractedTempo, setExtractedTempo] = useState(DEFAULT_TEMPO);
  const [currentNote, setCurrentNote] = useState('-');

  useEffect(() => {
    if (file) {
      fetch(file)
        .then((response) => response.text())
        .then((data) => {
          setAbcContent(data);
          extractTempo(data, tempo);
        })
        .catch((error) => console.error("Error loading ABC file:", error));
    }
  }, [file, tempo]);
  useEffect(() => {
    if (abcContent) {
      const renderedObj = ABCJS.renderAbc("abc-container", abcContent, {
        responsive: "resize",
        scale: 1.5,
        add_classes: true,
      });

      if (renderedObj.length > 0) {
        setVisualObj(renderedObj[0]);
      }
    }
  }, [abcContent]);

  useEffect(() => {
    if (isPlaying && visualObj) {
      start(visualObj, extractedTempo, setCurrentNote);
    } else {
      stop();
      setCurrentNote('-');
    }
  }, [isPlaying, extractedTempo]); 

  const extractTempo = (abcText, selectedTempo) => {
    if (selectedTempo === "inherit") {
      const match = abcText.match(/Q:\s*(\d+)/);
      const extracted = match ? parseInt(match[1], 10) : DEFAULT_TEMPO;
      setExtractedTempo(extracted);
    } else {
      setExtractedTempo(parseInt(selectedTempo, 10)); 
    }
  };

  return (
    <div className="w-full flex flex-col text-gray-500">
      <h2 className="self-center text-xl">{extractedTempo}</h2>
      <div id="abc-container" className={!isPlaying ? 'text-gray-500' : null}></div>
      <div className='flex justify-between'>
        <PitchDetector isTuning={isTuning} isPlaying={isPlaying} expectedNote={currentNote} />
        <h2 className="">{file}</h2>
      </div>
    </div>
  );
};

ABCNotation.propTypes = {
  file: PropTypes.string.isRequired,
  isTuning: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  tempo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ABCNotation;
