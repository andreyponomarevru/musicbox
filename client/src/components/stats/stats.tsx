import React from "react";

import { DatabaseStats, ResponseState } from "../../types";

import "./stats.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  response: ResponseState<DatabaseStats>;
  className?: string;
}

export function Stats(props: any /* Props*/) {
  const { response, className = "" } = props;

  if (!response.isLoaded) {
    return <div className={`stats stats_loading ${className}`}>Loading...</div>;
  } else {
    return (
      <div className={`stats ${className}`}>
        <span className="stats__box">
          <span className="stats__name">Releases</span>
          <span className="stats__count">{response.results.releases}</span>
        </span>
        <span className="stats__box">
          <span className="stats__name">Tracks</span>
          <span className="stats__count">{response.results.tracks}</span>
        </span>
        <span className="stats__box">
          <span className="stats__name">Artists</span>
          <span className="stats__count">{response.results.artists}</span>
        </span>
        <span className="stats__box">
          <span className="stats__name">Labels</span>
          <span className="stats__count">{response.results.labels}</span>
        </span>
        <span className="stats__box">
          <span className="stats__name">Genres</span>
          <span className="stats__count">{response.results.genres}</span>
        </span>
      </div>
    );
  }
}
