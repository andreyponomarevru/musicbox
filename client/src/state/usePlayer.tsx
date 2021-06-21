import { useEffect, useReducer } from "react";

type PlayNewTrack = {
  type: "PLAY_NEW_TRACK";
  payload: { audio: HTMLAudioElement; playingTrack: TrackExtendedMetadata };
};
type Pause = { type: "PAUSE" };
type Resume = { type: "RESUME" };

type State = {
  isPlaying: boolean;
  audio: HTMLAudioElement | null;
  playingTrack?: TrackExtendedMetadata;
};
type Action = PlayNewTrack | Pause | Resume;

type Player = [State, React.Dispatch<Action>];

//

function playerReducer(state: State, action: Action): State {
  switch (action.type) {
    case "PLAY_NEW_TRACK":
      if (state.audio) state.audio.pause();
      return {
        ...state,
        isPlaying: true,
        audio: action.payload.audio,
        playingTrack: action.payload.playingTrack,
      };
    case "PAUSE":
      return { ...state, isPlaying: false };
    case "RESUME":
      return { ...state, isPlaying: true };
    default:
      throw new Error();
  }
}

export function usePlayer(): Player {
  const initialState: State = {
    isPlaying: false,
    audio: null,
    playingTrack: undefined,
  };

  const [state, dispatch] = useReducer(playerReducer, initialState);
  const { audio, isPlaying } = state;

  useEffect(() => {
    if (audio && isPlaying) audio.play();
    else if (audio && !isPlaying) audio.pause();
  }, [isPlaying, audio]);

  return [state, dispatch];
}
