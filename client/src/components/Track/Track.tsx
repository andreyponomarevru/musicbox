import React, { Component } from "react";

import "./Track.scss";

import { TrackMetadata } from "./../../types";
import { toBitrate, toHoursMinSec } from "./../../utils/utils";

interface TrackProps extends React.HTMLAttributes<HTMLDivElement> {
  metadata: TrackMetadata;
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

    return (
      <div className="track">
        <img
          className="track__cover"
          src={`${APP_URL}${coverPath}`}
          alt={releaseTitle}
        />
        <span className="track__year">{year}</span>
        <a className="track__artist" href="#">
          {trackArtist[0]}
        </a>
        <span className="track__track-title">{trackTitle}</span>
        <span className="track__release">
          <a className="track__release-title" href="#">
            {releaseTitle}
          </a>
          <span className="track__label-info">
            <a className="track__label" href="#">
              {label}
            </a>
            {catNo ? <span className="track__cat-no"> — {catNo}</span> : ""}
          </span>
        </span>
        <span className="track__genres">{genre.join(", ")}</span>
        <span className="track__duration">{toHoursMinSec(duration)}</span>
        <span className="track__bitrate">{toBitrate(bitrate)}</span>
        <span className="track__extension">{extension}</span>
        <a href="#" className="track__more">
          More
        </a>
      </div>
    );
  }
}

export { Track };
