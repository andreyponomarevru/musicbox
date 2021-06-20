import React, { useState, useEffect, ReactElement } from "react";
import { Route } from "react-router-dom";

import { AppHeader } from "./../app-header/app-header";
import "./app.scss";
import "./app.scss";
import { Main } from "../page_main/main";
import { AddRelease } from "../page_add-release/add-release";
import { Player } from "../player/player";
import { usePlayer } from "../../state/usePlayer";

const { REACT_APP_API_ROOT } = process.env;
let timerId: NodeJS.Timeout;

// TODO: try to move pagination component deeper, into content-list/grid comp

export function App(): ReactElement {
  // Filters
  //const [filters, setFilters] = useState<null | string[]>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [layout, setLayout] = useState<Layout>("grid");
  const [{ playingTrack, isPlaying, audio }, dispatch] = usePlayer();

  function togglePlay(selectedTrack: TrackExtendedMetadata) {
    const audioURL = `${REACT_APP_API_ROOT}/tracks/${selectedTrack?.trackId}/stream`;

    // If we're starting player for the first time
    if (!playingTrack) {
      dispatch({
        type: "PLAY_NEW_TRACK",
        payload: { playingTrack: selectedTrack, audio: new Audio(audioURL) },
      });
      // If we've clicked on an already playing tracks
    } else if (playingTrack.trackId === selectedTrack?.trackId && isPlaying) {
      dispatch({ type: "PAUSE" });
      // If we've clicked on a paused tracks
    } else if (playingTrack.trackId === selectedTrack?.trackId && !isPlaying) {
      dispatch({ type: "RESUME" });
      // If we've clicked on a new track
    } else if (playingTrack.trackId !== selectedTrack?.trackId) {
      if (audio) audio.pause();
      dispatch({
        type: "PLAY_NEW_TRACK",
        payload: { playingTrack: selectedTrack, audio: new Audio(audioURL) },
      });
    }
  }

  function handleSearchInput(input: string) {
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
            handleListBtnClick={() => setLayout("list")}
            handleGridBtnClick={() => setLayout("grid")}
            setTrack={togglePlay}
            playingTrackId={playingTrack?.trackId}
          />
        )}
      />

      <Player
        setTrack={togglePlay}
        playingTrack={playingTrack}
        active={!!isPlaying}
      />

      <Route path="/release/add" component={AddRelease} />
    </div>
  );
}
