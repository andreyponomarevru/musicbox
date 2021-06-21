import React, { useState, useEffect, Fragment } from "react";

import { GridLayout } from "../grid-layout/grid-layout";
import { ListLayout } from "../list-layout/list-layout";
import { SearchLayout } from "../search-layout/search-layout";

interface Props {
  searchQuery: string;

  layout: Layout;
  handleGridBtnClick: () => void;
  handleListBtnClick: () => void;

  playingTrackId?: number;
  setTrack: (metadata: TrackExtendedMetadata) => void;
}

export function Main(props: Props): JSX.Element | null {
  const { playingTrackId, setTrack, handleGridBtnClick, handleListBtnClick } =
    props;

  switch (props.layout) {
    case "search":
      return (
        <SearchLayout searchQuery={props.searchQuery} togglePlay={setTrack} />
      );
    case "list":
      return (
        <ListLayout
          playingTrackId={playingTrackId}
          togglePlay={setTrack}
          handleBtnClick={handleGridBtnClick}
        />
      );
    default:
      return (
        <GridLayout
          playingTrackId={playingTrackId}
          togglePlay={setTrack}
          handleBtnClick={handleListBtnClick}
        />
      );
  }
}
