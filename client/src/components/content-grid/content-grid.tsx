import React, { useEffect } from "react";

import { Release } from "../release/release";
import { useFetch } from "../../state/useFetch";
import { Loader } from "../loader/loader";
import "./content-grid.scss";
import {
  PaginatedAPIResponse,
  ReleaseMetadata,
  TrackExtendedMetadata,
} from "../../types";

interface Props {
  url: string;
  handleLoadedData: ({
    totalCount,
    previousPage,
    nextPage,
  }: {
    totalCount: number;
    previousPage: string | null;
    nextPage: string | null;
  }) => void;

  playingTrackId?: number;
  togglePlay: (metadata: TrackExtendedMetadata) => void;

  className?: string;
}

export function ContentGrid(props: Props): JSX.Element {
  const { className = "" } = props;

  const releases = useFetch<PaginatedAPIResponse<ReleaseMetadata[]>>(props.url);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      props.handleLoadedData({
        totalCount: releases.response ? releases.response.totalCount : 0,
        previousPage: releases.response ? releases.response.previousPage : null,
        nextPage: releases.response ? releases.response.nextPage : null,
      });
    }

    return () => {
      isMounted = false;
    };
  }, [props.url, releases]);

  if (releases.error) {
    return <div>Oops! Something went wrong: {releases.error}</div>;
  } else if (releases.isLoading || !releases.response) {
    return <Loader />;
  }

  return (
    <div className={`content-grid ${className}`}>
      {...releases.response.results.map((release) => {
        return (
          <Release
            togglePlay={props.togglePlay}
            playingTrackId={props.playingTrackId}
            metadata={release}
            releaseId={release.id}
            key={release.id.toString()}
          />
        );
      })}
    </div>
  );
}
