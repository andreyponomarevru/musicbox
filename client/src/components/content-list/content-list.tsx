import React, { ReactElement, useEffect } from "react";

import { Track } from "../track/track";
import "./content-list.scss";
import { useFetch } from "../../state/useFetch";
import { Loader } from "../loader/loader";
import {
  PaginatedAPIResponse,
  TrackExtendedMetadata,
  PaginationParams,
} from "../../types";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  togglePlay: (metadata: TrackExtendedMetadata) => void;
  playingTrackId?: number;
  url: string;
  handleLoadedData: (paginationParams: PaginationParams) => void;
}

export function ContentList(props: Props): ReactElement {
  const { className = "" } = props;

  const tracks = useFetch<PaginatedAPIResponse<TrackExtendedMetadata[]>>(
    props.url
  );

  useEffect(() => {
    let isMounted = true;

    if (isMounted && tracks.response && tracks.response.totalCount > 0) {
      props.handleLoadedData({
        totalCount: tracks.response ? tracks.response.totalCount : 0,
        previousPage: tracks.response ? tracks.response.previousPage : null,
        nextPage: tracks.response ? tracks.response.nextPage : null,
      });
    }

    return () => {
      isMounted = false;
    };
  }, [props.url, tracks]);

  if (tracks.error) {
    return <div>Oops! Something went wrong...</div>;
  } else if (tracks.isLoading || !tracks.response) {
    return <Loader />;
  }

  if (tracks.response && tracks.response.results.length > 0) {
    const tracksJSX = tracks.response.results.map((track) => {
      return (
        <Track
          className={
            props.playingTrackId === track.trackId
              ? "track track_state_playing"
              : "track"
          }
          metadata={track}
          key={track.trackId.toString()}
          togglePlay={props.togglePlay}
        />
      );
    });

    return <div className={`content-list ${className}`}>{...tracksJSX}</div>;
  } else {
    return (
      <div className="content-list content-list_empty-response">
        No matching tracks.
      </div>
    );
  }
}
