import React, { Fragment } from "react";

import { ContentGrid } from "../content-grid/content-grid";
import { ContentList } from "../content-list/content-list";
import { ContentListHeader } from "../content-list-header/content-list-header";
import { Loader } from "../loader/loader";
import "./main.scss";
import {
  ResponseState,
  TrackExtendedMetadata,
  ReleaseMetadata,
  Layout,
} from "../../types";

interface Props {
  className?: string;
  layout: Layout;
  releases: ResponseState<ReleaseMetadata[]>;
  tracks: ResponseState<TrackExtendedMetadata[]>;
  playingTrackId?: number;
  togglePlay: (metadata: TrackExtendedMetadata) => void;
}

export function Main(props: Props) {
  const { className = "", layout, releases, tracks } = props;

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

  if (!releases.isLoaded && layout === "grid") return LoaderJSX;
  if (!tracks.isLoaded && layout === "list") return LoaderJSX;

  return (
    <main className={`main ${className}`}>
      <div className={`main__content ${className}`}>
        {layout === "list" ? (
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
