import { useEffect, useReducer } from "react";

import { TrackExtendedMetadata } from "../types";

const { REACT_APP_API_ROOT } = process.env;

type PlayNewTrack = {
  type: "PLAY_NEW_TRACK";
  payload: { audio: HTMLAudioElement; playingTrackMeta: TrackExtendedMetadata };
};
type Pause = { type: "PAUSE" };
type Resume = { type: "RESUME" };
type Stop = { type: "STOP" };

type State = {
  isPlaying: boolean;
  audio: HTMLAudioElement | null;
  playingTrackMeta?: TrackExtendedMetadata;
};
type Action = PlayNewTrack | Pause | Resume | Stop;

type Player = [State, (selectedTrack: TrackExtendedMetadata) => void];

//

function playerReducer(state: State, action: Action) {
  switch (action.type) {
    case "PLAY_NEW_TRACK":
      if (state.audio) state.audio.pause();
      return {
        ...state,
        isPlaying: true,
        audio: action.payload.audio,
        playingTrackMeta: action.payload.playingTrackMeta,
      };

    case "PAUSE":
      return { ...state, isPlaying: false };

    case "RESUME":
      return { ...state, isPlaying: true };

    case "STOP":
      return {
        ...state,
        isPlaying: false,
        audio: null,
        playingTrackMeta: undefined,
      };

    default:
      throw new Error();
  }
}

export function usePlayer(): Player {
  const initialState: State = {
    isPlaying: false,
    audio: null,
    playingTrackMeta: undefined,
  };

  const [state, dispatch] = useReducer(playerReducer, initialState);

  const togglePlay = (selectedTrack: TrackExtendedMetadata) => {
    console.log(selectedTrack);

    const audioURL = `${REACT_APP_API_ROOT}/tracks/${selectedTrack.trackId}/stream`;

    // If we're starting player for the first time
    if (!state.playingTrackMeta) {
      const audio = new Audio(audioURL);
      audio.loop = true;

      dispatch({
        type: "PLAY_NEW_TRACK",
        payload: {
          playingTrackMeta: selectedTrack,
          audio: audio,
        },
      });
      // If we've clicked on an already playing tracks
    } else if (
      state.playingTrackMeta.trackId === selectedTrack.trackId &&
      state.isPlaying
    ) {
      dispatch({ type: "PAUSE" });
      // If we've clicked on a paused tracks
    } else if (
      state.playingTrackMeta.trackId === selectedTrack.trackId &&
      !state.isPlaying
    ) {
      dispatch({ type: "RESUME" });
      // If we've clicked on a new track
    } else if (state.playingTrackMeta.trackId !== selectedTrack.trackId) {
      if (state.audio) state.audio.pause();
      dispatch({
        type: "PLAY_NEW_TRACK",
        payload: {
          playingTrackMeta: selectedTrack,
          audio: new Audio(audioURL),
        },
      });
    } else if (state.audio && state.audio.ended) {
      dispatch({ type: "STOP" });
    }
  };

  useEffect(() => {
    if (state.audio && state.isPlaying) state.audio.play();
    else if (state.audio && !state.isPlaying) state.audio.pause();
  }, [state.isPlaying, state.audio]);

  return [state, togglePlay];
}
