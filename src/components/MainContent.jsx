import React, { useState, useEffect } from 'react';
import ABCNotation from './ABCNotation';
import Playlist from './Playlist';

const MainContent = ({ file, isPlaying, isTuning, tempo, statusMessage }) => {
  const [playlist, setPlaylist] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentFile, setCurrentFile] = useState(file);

  useEffect(() => {
    if (file.endsWith('.pls')) {
      fetch(file)
        .then(response => response.text())
        .then(data => {
            const songs = data.split('\n')
            .filter(line => line.trim() !== '')
            .map(song => `./music/${song}`);
          setPlaylist(songs);
          setCurrentSongIndex(0);
          setCurrentFile(songs[0]);
        })
        .catch(error => console.error("Error loading playlist:", error));
    } else {
      setPlaylist([]);
      setCurrentFile(file);
    }
    console.log(playlist);
  }, [file]);

  const handleSelectSong = (index) => {
    setCurrentSongIndex(index);
    setCurrentFile(playlist[index]);
  };

  return (
    <div className="w-full flex flex-col mt-4 text-gray-600">
      {currentFile && (
        <ABCNotation file={currentFile} isPlaying={isPlaying} isTuning={isTuning} tempo={tempo} />
      )}
      <Playlist playlist={playlist} currentSongIndex={currentSongIndex} onSelect={handleSelectSong} />
    </div>
  );
};

export default MainContent;
