import React, { ReactElement } from "react";

import { Track } from "../track/track";
import "./content-list.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  tracks: TrackExtendedMetadata[];
  togglePlay: (metadata: TrackExtendedMetadata) => void;
  playingTrackId?: number;
}

export function ContentList(props: Props): ReactElement {
  const trackJSX = props.tracks.map((track) => {
    return (
      <Track
        className={
          props.playingTrackId === track.trackId
            ? "track track_state_playing"
            : "track"
        }
        metadata={track}
        key={track.trackId.toString()}
        togglePlay={props.togglePlay}
      />
    );
  });

  return <div className="content-list">{...trackJSX}</div>;
}
