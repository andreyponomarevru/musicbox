import React, { Fragment, ReactElement } from "react";

import "./player.scss";
import { TrackExtendedMetadata } from "../../types";

const { REACT_APP_API_ROOT } = process.env;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  active: boolean;
  playingTrack?: TrackExtendedMetadata;
  handleTogglePlay: any;
  className?: string;
}

const iconPlay = (
  <svg className="player__toggle-play-icon" viewBox="0 0 14 14">
    <path d="M12.84 6.016L3.54.166C3.267.002 2.923.03 2.666.03c-1.034-.006-1.028.792-1.028.995v11.973c0 .175 0 1 1.028 1 .257 0 .601.028.874-.136L12.84 8c.765-.454.634-.984.634-.984s.131-.542-.634-.995z" />
  </svg>
);

const iconPause = (
  <svg className="player__toggle-play-icon" viewBox="0 0 14 14">
    <path d="M5.305 1.492h-2.12a.847.847 0 00-.848.843v9.326c0 .467.38.847.848.847h2.12a.847.847 0 00.848-.847V2.335a.847.847 0 00-.848-.843zm5.51 0h-2.12a.847.847 0 00-.848.843v9.326c0 .467.38.847.848.847h2.12a.847.847 0 00.848-.847V2.335a.847.847 0 00-.848-.843z" />
  </svg>
);

export function Player(props: Props): ReactElement {
  const { className = "", playingTrack } = props;

  let playingTrackJSX;
  if (playingTrack) {
    playingTrackJSX = (
      <Fragment>
        <img
          src={`${REACT_APP_API_ROOT}/${playingTrack.coverPath}`}
          className="player__cover"
          alt={playingTrack.releaseTitle}
        />
        <div className="player__meta">
          <div className="player__track-title">{playingTrack.trackTitle}</div>
          <div className="player__track-artist">{playingTrack.trackArtist}</div>
        </div>
      </Fragment>
    );
  } else playingTrack;

  function onPlayClick() {
    if (props.playingTrack) props.handleTogglePlay(props.playingTrack);
  }

  return (
    <div className={`player ${className}`}>
      {playingTrackJSX}
      <button onClick={onPlayClick} className="player__btn">
        {props.active ? iconPause : iconPlay}
      </button>
    </div>
  );
}
