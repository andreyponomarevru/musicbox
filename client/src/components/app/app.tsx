import React, { useState, useEffect, ReactElement } from "react";
import { Route } from "react-router-dom";

import { AppHeader } from "./../app-header/app-header";
import "./app.scss";
import "./app.scss";
import { Main } from "../page_main/main";
import { AddRelease } from "../page_add-release/add-release";
import { Player } from "../player/player";
import { useFetch } from "../../state/useFetch";

const { REACT_APP_API_ROOT } = process.env;
let timerId: NodeJS.Timeout;

// TODO: try to move pagination component deeper, into content-list/grid comp

export function App(): ReactElement {
  // Filters
  //const [filters, setFilters] = useState<null | string[]>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [layout, setLayout] = useState<Layout>("grid");

  // Player
  // TODO: group in one object
  // Add event lsitener to "end" event to start playing a new https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<null | HTMLAudioElement>(null);
  const [playingTrack, setPlayingTrack] = useState<
    undefined | TrackExtendedMetadata
  >(undefined);

  //

  function togglePlay(selectedTrack: TrackExtendedMetadata) {
    const audioURL = `${REACT_APP_API_ROOT}/tracks/${selectedTrack.trackId}/stream`;

    // If we're starting player for the first time
    if (!playingTrack) {
      setPlayingTrack(selectedTrack);
      setAudio(new Audio(audioURL));
      setIsPlaying(true);
      // If we've clicked on an already playing tracks
    } else if (playingTrack.trackId === selectedTrack.trackId && isPlaying) {
      setIsPlaying(false);
      // If we've clicked on a paused tracks
    } else if (playingTrack.trackId === selectedTrack.trackId && !isPlaying) {
      setIsPlaying(true);
      // If we've clicked on a new track
    } else if (playingTrack.trackId !== selectedTrack.trackId) {
      if (audio) audio.pause();
      setPlayingTrack(selectedTrack);
      setAudio(new Audio(audioURL));
      setIsPlaying(true);
    }
  }

  // Player
  useEffect(() => {
    if (audio && isPlaying) audio.play();
    else if (audio && !isPlaying) audio.pause();
  }, [isPlaying, audio]);

  function handleListBtnClick() {
    setLayout("list");
  }

  function handleGridBtnClick() {
    setLayout("grid");
  }

  function handleSearchInput(input: string) {
    console.log("<App> TRIGGERED");

    if (timerId) clearTimeout(timerId);

    if (input.length > 1) {
      timerId = setTimeout(() => {
        setSearchQuery(input);
        if (layout !== "search") setLayout("search");
      }, 700);
    } else {
      setLayout("grid");
    }
  }

  return (
    <div className="app">
      <AppHeader handleSearchInput={handleSearchInput} />

      <Route
        exact
        path="/"
        render={() => (
          <Main
            layout={layout}
            searchQuery={searchQuery}
            handleListBtnClick={handleListBtnClick}
            handleGridBtnClick={handleGridBtnClick}
            togglePlay={togglePlay}
            playingTrackId={playingTrack ? playingTrack.trackId : undefined}
          />
        )}
      />

      <Player
        handleTogglePlay={togglePlay}
        playingTrack={playingTrack}
        active={!!isPlaying}
      />

      <Route path="/release/add" component={AddRelease} />
    </div>
  );
}
