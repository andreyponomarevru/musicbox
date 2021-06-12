import React, { useEffect, useState, Fragment } from "react";
import { Route, NavLink, HashRouter } from "react-router-dom";

import { ContentGrid } from "../content-grid/content-grid";
import { ContentList } from "../content-list/content-list";
import { ContentListHeader } from "../content-list-header/content-list-header";
import { Stats } from "../stats/stats";
import { Loader } from "../loader/loader";
import { Pagination } from "../pagination/pagination";
import { SelectSort } from "../select-sort/select-sort";
import { SelectItemsPerPage } from "../select-items-per-page/select-items-per-page";
import { GroupingBtn } from "../grouping-btn/grouping-btn";
import "./main.scss";
import {
  ResponseState,
  TrackExtendedMetadata,
  ReleaseMetadata,
  DatabaseStats,
} from "../../types";

interface Props {
  className?: string;
  isGridLayoutActive: boolean;
  isListLayoutActive: boolean;
  releases: ResponseState<ReleaseMetadata[]>;
  tracks: ResponseState<TrackExtendedMetadata[]>;
  playingTrackId?: number;
  togglePlay: (metadata: TrackExtendedMetadata) => void;
}

export function Main(props: Props) {
  const {
    className = "",
    isGridLayoutActive,
    isListLayoutActive,
    releases,
    tracks,
  } = props;

  if ("errorCode" in tracks) return null;

  if (tracks.err) {
    //<main className={className}>No Tracks</main>;
    throw tracks.err;
  } else if (releases.err) {
    //<main className={className}>No Releases</main>;
    throw releases.err;
  }

  const LoaderJSX = (
    <main className={`content ${className}`}>
      <Loader />
    </main>
  );

  if (!releases.isLoaded && isGridLayoutActive) return LoaderJSX;
  if (!tracks.isLoaded && isListLayoutActive) return LoaderJSX;

  return (
    <main className={`main ${className}`}>
      <div className={`main__content ${className}`}>
        {isListLayoutActive ? (
          <Fragment>
            <ContentListHeader />
            <ContentList
              tracks={props.tracks.results}
              togglePlay={props.togglePlay}
              playingTrackId={props.playingTrackId}
            />
          </Fragment>
        ) : (
          <ContentGrid releases={props.releases.results} />
        )}
      </div>
    </main>
  );
}
