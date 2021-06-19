import React from "react";

import "./stats.scss";

export type Props = {
  stats: APIResponse<NotPaginatedAPIResponse<DatabaseStats>>;
  className?: string;
};

//

export function Stats(props: Props): JSX.Element {
  const { className = "" } = props;

  if (props.stats.isLoading || !props.stats.response) {
    return <div className={`stats stats_loading ${className}`}>Loading...</div>;
  } else if (props.stats.error) {
    return (
      <div className={`stats stats_loading ${className}`}>
        Oops! Something went wrong...
      </div>
    );
  } else {
    const {
      releases = "",
      tracks = "",
      artists = "",
      labels = "",
      genres = "",
    } = props.stats.response.results;

    return (
      <div className={`stats ${className}`}>
        <span className="stats__box">
          <span className="stats__name">Releases</span>
          <span className="stats__count">{releases}</span>
        </span>
        <span className="stats__box">
          <span className="stats__name">Tracks</span>
          <span className="stats__count">{tracks}</span>
        </span>
        <span className="stats__box">
          <span className="stats__name">Artists</span>
          <span className="stats__count">{artists}</span>
        </span>
        <span className="stats__box">
          <span className="stats__name">Labels</span>
          <span className="stats__count">{labels}</span>
        </span>
        <span className="stats__box">
          <span className="stats__name">Genres</span>
          <span className="stats__count">{genres}</span>
        </span>
      </div>
    );
  }
}
