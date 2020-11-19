import React, { Component } from "react";

import { ReleaseMetadata } from "./../../types";
import { Release } from "./../Release/Release";

import "./Content.scss";

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  releases: ReleaseMetadata[];
}
interface ContentState {}

class Content extends Component<ContentProps, ContentState> {
  render() {
    /*
    const releases = [];
    for (const albumName in this.props.releases) {
      releases.push(
        <Release
          className="track"
          metadata={this.props.releases[albumName]}
          key={this.props.releases[albumName].releaseId}
        />
      );
    }*/

    const releases = this.props.releases.map((track) => {
      return (
        <Release className="release" metadata={track} key={track.releaseId} />
      );
    });

    return <main className={this.props.className}>{...releases}</main>;
  }
}

export { Content };
