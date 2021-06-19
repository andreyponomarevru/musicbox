import React from "react";

import { Release } from "../release/release";

import "./content-grid.scss";

interface Props {
  releases: ReleaseMetadata[];
  playingTrackId?: number;

  togglePlay: (metadata: TrackExtendedMetadata) => void;

  className?: string;
}

//

export function ContentGrid(props: Props): JSX.Element {
  const { className = "" } = props;

  console.log(props.playingTrackId);

  return (
    <div className={`content-grid ${className}`}>
      {...props.releases.map((release) => {
        return (
          <Release
            togglePlay={props.togglePlay}
            playingTrackId={props.playingTrackId}
            metadata={release}
            releaseId={release.id}
            key={release.id.toString()}
          />
        );
      })}
    </div>
  );
}
