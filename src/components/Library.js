import React from "react";
import LibrarySong from "./LibrarySong";

const Library = ({
  songs,
  setSongs,
  setCurrentSong,
  isPlaying,
  setIsPlaying,
  libraryStatus,
  audioRef,
}) => {
  return (
    <div
      className={`library-container ${libraryStatus ? "active-library" : ""} `}
    >
      <h2>Library</h2>
      <div className="library-songs">
        {songs.map((song) => (
          <LibrarySong
            key={song.id}
            cover={song.cover}
            name={song.name}
            audioRef={audioRef}
            artist={song.artist}
            active={song.active}
            song={song}
            setSongs={setSongs}
            songs={songs}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            setCurrentSong={setCurrentSong}
          />
        ))}
      </div>
    </div>
  );
};

export default Library;
