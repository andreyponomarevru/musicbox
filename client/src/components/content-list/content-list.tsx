import React, { Component } from "react";

import { TrackExtendedMetadata } from "../../types";
import { Track } from "../track/track";

import "./content-list.scss";

interface ContentListProps extends React.HTMLAttributes<HTMLDivElement> {
  tracks: TrackExtendedMetadata[];
}
interface ContentListState {}

class ContentList extends Component<ContentListProps, ContentListState> {
  render() {
    const tracks = this.props.tracks.map((track) => {
      return (
        <Track
          className="track"
          metadata={track}
          key={track.trackId.toString()}
        />
      );
    });

    return <main className="content-list">{...tracks}</main>;
  }
}

export { ContentList };
