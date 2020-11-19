import React, { Component } from "react";

import "./Release.scss";

import { ReleaseMetadata } from "./../../types";

interface ReleaseProps extends React.HTMLAttributes<HTMLDivElement> {
  metadata: ReleaseMetadata;
}
interface ReleaseState {}

class Release extends Component<ReleaseProps, ReleaseState> {
  render() {
    return (
      <div className={this.props.className}>
        <figure className={this.props.className}>
          <picture className={`${this.props.className}__wrapper`}>
            <img
              className={`${this.props.className}__img`}
              src={this.props.metadata.coverPath}
              alt={this.props.metadata.title || ""}
            />

            <figcaption className={`${this.props.className}__caption`}>
              {this.props.metadata.artist} - {this.props.metadata.title}
            </figcaption>
          </picture>
        </figure>
      </div>
    );
  }
}

export { Release };
