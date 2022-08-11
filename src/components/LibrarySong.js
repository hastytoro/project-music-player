import React from "react";

const LibrarySong = ({
  name,
  artist,
  cover,
  active,
  song,
  songs,
  setSongs,
  setCurrentSong,
  isPlaying,
  audioRef,
}) => {
  const songSelectHandler = async () => {
    await setCurrentSong(song);
    // We return updated active state (but we don't mutate directly):
    const newSong = songs.map((currentState) =>
      currentState.id === song.id
        ? { ...currentState, active: true }
        : { ...currentState, active: false }
    );
    setSongs(newSong);
    // Check if ref promise is playing:
    if (isPlaying) audioRef.current.play();
  };

  return (
    <div
      className={`library-song ${song.active ? "selected" : ""}`}
      onClick={songSelectHandler}
    >
      <img src={song.cover} alt={song.name} />
      <div className="song-description">
        <h3>{song.name}</h3>
        <h4>{song.artist}</h4>
      </div>
    </div>
  );
};

export default LibrarySong;
