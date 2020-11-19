import React, { Component } from "react";

import "./Track.scss";

import { TrackMetadata } from "./../../types";

interface TrackProps extends React.HTMLAttributes<HTMLDivElement> {
  metadata: TrackMetadata;
}
interface TrackState {}

const APP_URL = "http://musicbox.com:8000";

class Track extends Component<TrackProps, TrackState> {
  render() {
    return (
      <div className={this.props.className}>
        <figure className={this.props.className}>
          <picture className={`${this.props.className}__wrapper`}>
            <img
              className={`${this.props.className}__img`}
              src={`${APP_URL}${this.props.metadata.coverPath}`}
              alt={this.props.metadata.releaseTitle || ""}
            />

            <figcaption className={`${this.props.className}__caption`}>
              {this.props.metadata.releaseArtist} -{" "}
              {this.props.metadata.releaseTitle}
            </figcaption>
          </picture>
        </figure>
      </div>
    );
  }
}

export { Track };
