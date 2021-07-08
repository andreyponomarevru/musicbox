import React from "react";

import "./track.scss";
import { toBitrate, toHoursMinSec } from "../../utils/utils";
import { TrackExtendedMetadata } from "../../types";

const { REACT_APP_API_ROOT } = process.env;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  metadata: TrackExtendedMetadata;
  togglePlay: (metadata: TrackExtendedMetadata) => void;
}

const menuIcon = (
  <svg className="track__menu" viewBox="0 0 7 14">
    <path d="M2.213 10.914a1.287 1.287 0 102.573.001 1.287 1.287 0 00-2.573-.001zm0-3.98a1.287 1.287 0 102.575 0 1.287 1.287 0 00-2.575 0zm0-3.848a1.287 1.287 0 102.574.001 1.287 1.287 0 00-2.574-.001z" />
  </svg>
);

function Track(props: Props) {
  const {
    extension,
    releaseArtist,
    trackArtist,
    duration,
    bitrate,
    year,
    trackNo,
    releaseTitle = "",
    trackTitle,
    diskNo,
    genre,
    label,
    coverPath,
    catNo,
    trackId,
  } = props.metadata;

  const { className } = props;

  return (
    <div
      role="button"
      tabIndex={0}
      className={className}
      onKeyDown={() => props.togglePlay(props.metadata)}
      onClick={() => props.togglePlay(props.metadata)}
    >
      <img
        className="track__cover"
        src={`${REACT_APP_API_ROOT}/${coverPath}`}
        alt={releaseTitle}
        loading="lazy"
      />
      <span className="track__year">{year}</span>
      <span className="track__artist">{trackArtist.join(", ")}</span>
      <span className="track__track-title">{trackTitle}</span>
      <span className="track__release">
        <span>{releaseTitle}</span>
        <span className="track__label-info">
          {label}
          {catNo ? <span className="track__cat-no"> — {catNo}</span> : ""}
        </span>
      </span>
      <span className="track__genres">
        {...genre.map((genre, index) => {
          return <span key={index + trackId}>{genre}</span>;
        })}
      </span>
      <span className="track__duration">{toHoursMinSec(duration)}</span>
      <span className="track__bitrate">
        {bitrate ? toBitrate(bitrate) : "—"}
      </span>
      <span className="track__extension">{extension || "—"}</span>
      {/*menuIcon*/}
    </div>
  );
}

export { Track };
