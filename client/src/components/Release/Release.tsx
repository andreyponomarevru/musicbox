import React, { Component } from "react";

import "./Release.scss";

import { ReleaseMetadata } from "./../../types";

interface ReleaseProps extends React.HTMLAttributes<HTMLDivElement> {
  metadata: ReleaseMetadata;
}
interface ReleaseState {}

class Release extends Component<ReleaseProps, ReleaseState> {
  render() {
    const { artist, title, coverPath } = this.props.metadata;

    return (
      <figure className="release">
        <a href="#" className="release__link">
          <picture className="release__wrapper">
            <img className="release__img" src={coverPath} alt={title || ""} />
            <figcaption className="release__caption">
              <strong className="release__title">{title}</strong>
              <span className="release__artist">{artist}</span>
            </figcaption>
          </picture>
        </a>
      </figure>
    );
  }
}

export { Release };
