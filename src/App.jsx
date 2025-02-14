import React, { useState } from 'react';
import Settings from './components/Settings';
import MainContent from './components/MainContent';
import DescriptionText from './components/DescriptionText';


function App() {
  const [selectedFile, setSelectedFile] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTuning, setIsTuning] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Select a file to begin.");
  const [tempo, setTempo] = useState("inherit"); // ✅ Now managed here

  const handleStart = () => {
    setIsPlaying((prev) => {
      const newState = !prev;
      setStatusMessage(newState ? "Playing..." : "Stopped.");
      return newState;
    });
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStatusMessage("Reset. Press Start to Play.");
  };

  const handleTune = () => {
    setIsTuning((prev) => {
      const newState = !prev;
      setStatusMessage(newState ? "Tuning active." : "Tuning stopped.");
      return newState;
    });
  };

  const handleFileChange = (file) => {
    setSelectedFile(file);
    setStatusMessage("File loaded. Press Start to Play.");
  };

  const handleTempoChange = (newTempo) => {
    setTempo(newTempo);
  };

  return (
    <div className="flex text-gray-900 font-mono flex-col justify-center items-center pt-8 px-12 md:px-20 space-y-4 max-w-full md:max-w-[1200px] mx-auto">
      <h3 className='text-4xl font-[500]'>ABC Sightreader</h3>

      <DescriptionText message={statusMessage}/>

      <Settings 
        onFileChange={handleFileChange} 
        onStart={handleStart} 
        onReset={handleReset} 
        onTune={handleTune} 
        isPlaying={isPlaying} 
        isTuning={isTuning} 
        onTempoChange={handleTempoChange} 
      />

      <MainContent 
        file={selectedFile} 
        isPlaying={isPlaying} 
        isTuning={isTuning} 
        tempo={tempo}
        statusMessage={statusMessage} 
      />
    </div>
  );
}

export default App;
