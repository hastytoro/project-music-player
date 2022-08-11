import React, { useRef, useState } from "react";
import Player from "./components/Player";
import Song from "./components/Song";
import Library from "./components/Library";
import Nav from "./components/Nav";

import data from "./data";

import "./styles/app.scss";

let defaults = {
  currentTime: 0,
  duration: 0,
  animationPercentage: 0,
  volume: 0.5,
};

function App() {
  const [songs, setSongs] = useState(data());
  const [songInfo, setSongInfo] = useState(defaults);
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [libraryStatus, setLibraryStatus] = useState(false);

  const audioRef = useRef("null");
  // console.log(audioRef);

  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    // Here we calculate percentage:
    const currentRounded = Math.round(current);
    const durationRounded = Math.round(duration);
    const percentage = Math.round((currentRounded / durationRounded) * 100);

    setSongInfo({
      ...songInfo,
      currentTime: current,
      duration: duration,
      animationPercentage: percentage,
      volume: e.target.volume,
    });
  };

  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    await setCurrentSong(songs[(currentIndex + 1) % songs.length]); // same logic as Player
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then((audio) => {
            audioRef.current.play();
          })
          .catch((error) => {
            console.log(error);
            audioRef.current.play();
          });
      }
    }
  };

  return (
    <div className={`App ${libraryStatus ? "library-active" : ""}`}>
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
      <Song currentSong={currentSong} isPlaying={isPlaying} />
      <Player
        songs={songs}
        setSongs={setSongs}
        songInfo={songInfo}
        setSongInfo={setSongInfo}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        audioRef={audioRef}
      />
      <Library
        songs={songs}
        setSongs={setSongs}
        setCurrentSong={setCurrentSong}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        libraryStatus={libraryStatus}
        audioRef={audioRef}
      />
      <audio
        ref={audioRef}
        src={currentSong.audio}
        onLoadedMetadata={timeUpdateHandler}
        onTimeUpdate={timeUpdateHandler}
        onEnded={songEndHandler}
      ></audio>
    </div>
  );
}
// We use the following `audio` tag attributes:
// https://www.w3schools.com/jsref/event_ontimeupdate.asp
// https://www.w3schools.com/jsref/event_onloadedmetadata.asp
// https://www.w3schools.com/jsref/event_onended.asp

export default App;
