import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faAngleLeft,
  faAngleRight,
  faPause,
  faVolumeLow,
} from "@fortawesome/free-solid-svg-icons";

const Player = ({
  songs,
  setSongs,
  songInfo,
  currentSong,
  setCurrentSong,
  setSongInfo,
  isPlaying,
  setIsPlaying,
  audioRef,
}) => {
  const [activeVolume, setActiveVolume] = useState(false);
  const activeLibrary = (nextPrev) => {
    // We return updated active state (but we don't mutate directly):
    const newSongs = songs.map((currentState) =>
      currentState.id === nextPrev.id
        ? { ...currentState, active: true }
        : { ...currentState, active: false }
    );
    setSongs(newSongs);
  };
  const getTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    // https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
    return minutes + ":" + ("0" + seconds).slice(-2);
  };

  // HANDLERS
  const playSongHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(!isPlaying); // toggle by switching opposite
    } else {
      audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };
  const skipTrackHandler = async (direction) => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    if (direction === "forward") {
      await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
      activeLibrary(songs[(currentIndex + 1) % songs.length]); // Move library element at the same time.
      // https://stackoverflow.com/questions/17524673/understanding-the-modulus-operator
      // Using modulus inside a function to determine the array index.
      // Example 5 % 8 = 5 because your 5 is less than 8.
      // Unlike the usual use where 8 % 5 = 3 because 3 is the (remaining).
      // We calc what the next array song is till we reach the end.
      // By definition "you cannot divide" the whole 5 items on 8.
      // - So the division doesn't take place at all.
      // You end up with the same amount you started with which is 5.
      // Finally 8 % 8 = 0 handles division and leaves you with zero.
    }
    if (direction === "backward") {
      // Here we only prevent an error with inner if condition.
      // If we attempt to go back beyond "under" the first array element.
      if ((currentIndex - 1) % songs.length === -1) {
        await setCurrentSong(songs[songs.length - 1]); // We then move to the end index of the array.
        activeLibrary(songs[songs.length - 1]); // Move library element at the same time.
        if (isPlaying) audioRef.current.play(); // Play last "end" element in your arrary.
        return; // exit logic
      }
      await setCurrentSong(songs[(currentIndex - 1) % songs.length]);
      activeLibrary(songs[(currentIndex - 1) % songs.length]); // Move library element at the same time.
    }
    if (isPlaying) audioRef.current.play();
  };
  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value;
    setSongInfo({
      ...songInfo,
      currentTime: e.target.value,
    });
  };
  const volumeHandler = (e) => {
    let value = e.target.value;
    audioRef.current.volume = value;
    setSongInfo({ ...songInfo, volume: value });
  };

  return (
    <div className="player-container">
      <div className="time-control">
        <p>{getTime(songInfo.currentTime)}</p>
        <div
          style={{
            background: `linear-gradient(to right,
              ${currentSong.color[0]},${currentSong.color[1]})`,
          }}
          className="track"
        >
          <input
            type="range"
            min={0}
            max={songInfo.duration || 0}
            value={songInfo.currentTime}
            onChange={dragHandler}
          />
          <div
            style={{
              transform: `translateX(${songInfo.animationPercentage}%)`,
            }}
            className="animate-track"
          ></div>
        </div>
        <p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
      </div>

      <div className="play-control">
        <FontAwesomeIcon
          onClick={() => skipTrackHandler("backward")}
          className="backward"
          icon={faAngleLeft}
          size="2x"
        />
        <FontAwesomeIcon
          onClick={playSongHandler}
          className="play"
          icon={isPlaying ? faPause : faPlay}
          size="2x"
        />
        <FontAwesomeIcon
          onClick={() => skipTrackHandler("forward")}
          className="forward"
          icon={faAngleRight}
          size="2x"
        />
      </div>
      <div className="volume">
        <FontAwesomeIcon
          onClick={() => setActiveVolume(!activeVolume)}
          icon={faVolumeLow}
          size="2x"
        />
        <input
          className={`volume-slider ${
            activeVolume ? "active-volume-slider" : ""
          }`}
          onChange={volumeHandler}
          value={songInfo.volume}
          max="1.0"
          min="0.0"
          step="0.01"
          type="range"
        />
      </div>
    </div>
  );
};

export default Player;
