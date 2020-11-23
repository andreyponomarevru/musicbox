import React, { Component } from "react";

import { ReleaseMetadata } from "../../types";
import { Release } from "../Release/Release";

import "./ContentGrid.scss";

interface ContentGridProps extends React.HTMLAttributes<HTMLDivElement> {
  releases: ReleaseMetadata[];
}
interface ContentGridState {}

class ContentGrid extends Component<ContentGridProps, ContentGridState> {
  render() {
    const releases = this.props.releases.map((track) => {
      return <Release className="track" metadata={track} key={track.id} />;
    });

    return <main className="content-grid">{...releases}</main>;
  }
}

export { ContentGrid };
