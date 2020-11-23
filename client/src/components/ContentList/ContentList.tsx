import React, { Component } from "react";

import { TrackMetadata } from "../../types";
import { Track } from "./../Track/Track";

import "./ContentList.scss";

interface ContentListProps extends React.HTMLAttributes<HTMLDivElement> {
  tracks: TrackMetadata[];
}
interface ContentListState {}

class ContentList extends Component<ContentListProps, ContentListState> {
  render() {
    const tracks = this.props.tracks.map((track) => {
      return <Track className="release" metadata={track} key={track.trackId} />;
    });

    return <main className="content-list">{...tracks}</main>;
  }
}

export { ContentList };
