import React from 'react';

const Playlist = ({ playlist, currentSongIndex, onSelect }) => {
  if (!playlist.length) return null;

  return (
    <div className="mt-4">
      <ul className="border p-2">
        {playlist.map((song, index) => (
          <li
            key={index}
            className={`p-1 cursor-pointer ${index === currentSongIndex ? 'bg-blue-200' : ''}`}
            onClick={() => onSelect(index)}
          >
            {song}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;
