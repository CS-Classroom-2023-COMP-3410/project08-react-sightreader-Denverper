import React, { useState } from 'react';
import DropDown from './DropDown';
import Button from './Button';

const availableFiles = [
  "--Custom ABC--",
  "beginner.pls",
  "cecilio-lesson3-exercise-3.abc",
  "cecilio-lesson2-twinkle-twinkle-little-star.abc",
  "cecilio-lesson3-exercise-2.abc",
  "cecilio-lesson3-exercise-1.abc",
  "cecilio-lesson8-largo.abc",
  "cecilio-lesson3-exercise-4.abc",
  "cecilio-lesson5-eighth-notes.abc",
  "cecilio-lesson5-the-old-gray-goose.abc",
  "lesson2-1st-finger-exercise-5.abc",
  "cecilio-lesson7-gavotte.abc",
  "lesson2-1st-finger-exercise-4.abc",
  "cecilio-lesson4-russian-dance-tune.abc",
  "lesson2-1st-finger-exercise-6.abc",
  "cecilio-lesson7-can-can.abc",
  "lesson2-1st-finger-exercise-3.abc",
  "cecilio-lesson4-camptown-races.abc",
  "cecilio-lesson1-open-strings.abc",
  "lesson2-1st-finger-exercise-2.abc",
  "lesson2-1st-finger-exercise-1.abc",
  "cecilio-lesson2-first-position.abc",
  "cecilio-lesson6-first-position-d-string.abc",
  "lesson1-open-string-exercise-6.abc",
  "lesson1-open-string-exercise-4.abc",
  "lesson1-open-string-exercise-5.abc",
  "cecilio-lesson4-lightly-row.abc",
  "lesson1-open-string-exercise-1.abc",
  "lesson1-open-string-exercise-2.abc",
  "cecilio-lesson3-mary-had-a-little-lamb.abc",
  "lesson1-open-string-exercise-3.abc",
  "cecilio-lesson8-dixie.abc",
  "hot-cross-buns.abc",
  "cecilio-lesson7-country-gardens.abc",
  "cecilio-lesson6-scherzando.abc",
  "cecilio-lesson3-jingle-bells.abc",
  "cecilio-lesson6-ode-to-joy.abc",
  "cecilio-lesson5-hungarian-folk-song-1.abc"
];

const availableTempos = [
    "inherit",
    "30",
    "60",
    "90",
    "120",
    "180",
    "240",
];

const Settings = ({ onFileChange, onStart, onReset, onTune, isPlaying, isTuning, onTempoChange }) => {
  const [selectedFile, setSelectedFile] = useState(availableFiles[2]);
  const [selectedTempo, setSelectedTempo] = useState('inherit');
  const [selectedMic, setSelectedMic] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.value;
    setSelectedFile(file);
    onFileChange(file);
  };

  const handleTempoChange = (e) => {
    const newTempo = e.target.value;
    setSelectedTempo(newTempo);
    onTempoChange(newTempo);  // ✅ Notify parent (App.jsx)
  };

  return (
    <div className="flex flex-wrap gap-4">
      <DropDown type="mic" value={selectedMic} onChange={(e) => setSelectedMic(e.target.value)} />
      <DropDown type="file" value={selectedFile} onChange={handleFileChange} availableFiles={availableFiles} />
      <DropDown type="tempo" value={selectedTempo} onChange={handleTempoChange} availableTempos={availableTempos} />
      <Button label={isPlaying ? "Stop" : "Start"} onClick={onStart} />
      <Button label="Reset" onClick={onReset} />
      <Button label="Tune" onClick={onTune} color={isTuning ? "red" : null} />
    </div>
  );
};

export default Settings;

