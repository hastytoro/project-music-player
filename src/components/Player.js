import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faAngleLeft,
  faAngleRight,
  faPause,
} from "@fortawesome/free-solid-svg-icons";

const Player = ({ currentSong, isPlaying, setIsPlaying }) => {
  // STATES AND HOOKS
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
  });
  const audioRef = useRef("null");

  // HANDLERS
  const backSongHandler = () => {};
  const playSongHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(!isPlaying); // toggle by switching opposite
    } else {
      audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };
  const forwardSongHandler = () => {};
  const timeUpdateHandler = (e) => {
    setSongInfo({
      ...songInfo,
      currentTime: e.target.currentTime,
      duration: e.target.duration,
    });
  };
  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value;
    setSongInfo({
      ...songInfo,
      currentTime: e.target.value,
    });
  };
  const getTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    // https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
    return minutes + ":" + ("0" + seconds).slice(-2);
  };

  return (
    <div className="player-container">
      <div className="time-control">
        <p>{getTime(songInfo.currentTime)}</p>
        <input
          type="range"
          min={0}
          max={songInfo.duration}
          value={songInfo.currentTime}
          onChange={dragHandler}
        />
        <p>{getTime(songInfo.duration)}</p>
      </div>

      <div className="play-control">
        <FontAwesomeIcon
          onClick={backSongHandler}
          className="back"
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
          onClick={forwardSongHandler}
          className="forward"
          icon={faAngleRight}
          size="2x"
        />
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={timeUpdateHandler}
        onLoadedMetadata={timeUpdateHandler}
        src={currentSong.audio}
      ></audio>
    </div>
  );
};

export default Player;
