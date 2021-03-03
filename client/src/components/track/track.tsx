import React, { Component } from "react";

import "./track.scss";

import { TrackExtendedMetadata } from "../../types";
import { toBitrate, toHoursMinSec } from "../../utils/utils";

interface TrackProps extends React.HTMLAttributes<HTMLDivElement> {
  metadata: TrackExtendedMetadata;
}
interface TrackState {}

const APP_URL = "http://musicbox.com:8000";

class Track extends Component<TrackProps, TrackState> {
  render() {
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
    } = this.props.metadata;

    const { className } = this.props;

    return (
      <div className={className}>
        <img
          className="track__cover"
          src={`${APP_URL}${coverPath}`}
          alt={releaseTitle}
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
        <span className="track__genres">{genre.join(", ")}</span>
        <span className="track__duration">{toHoursMinSec(duration)}</span>
        <span className="track__bitrate">
          {bitrate ? toBitrate(bitrate) : "—"}
        </span>
        <span className="track__extension">{extension || "—"}</span>
      </div>
    );
  }
}

export { Track };
