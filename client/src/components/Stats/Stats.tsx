import React, { Component, useImperativeHandle } from "react";

import "./Stats.scss";

interface StatsProps extends React.HTMLAttributes<HTMLDivElement> {
  error: Error | null;
  loaded: boolean;
  values: {
    releases: number;
    tracks: number;
    artists: number;
    labels: number;
    genres: number;
  };
}

interface StatsState {}

class Stats extends Component<StatsProps, StatsState> {
  constructor(props: StatsProps) {
    super(props);
  }

  render() {
    const { error, loaded, values, className = "stats" } = this.props;

    if (error) {
      return (
        <div className={`${className} stats_error`}>Error: {error.message}</div>
      );
    } else if (!loaded) {
      return <div className={`${className} stats_loading`}>Loading...</div>;
    } else {
      return (
        <div className={className}>
          <span className="stats__box">
            <span className="stats__name">Releases</span>
            <span className="stats__count">{values.releases}</span>
          </span>
          <span className="stats__box">
            <span className="stats__name">Tracks</span>
            <span className="stats__count">{values.tracks}</span>
          </span>
          <span className="stats__box">
            <span className="stats__name">Artists</span>
            <span className="stats__count">{values.artists}</span>
          </span>
          <span className="stats__box">
            <span className="stats__name">Labels</span>
            <span className="stats__count">{values.labels}</span>
          </span>
          <span className="stats__box">
            <span className="stats__name">Genres</span>
            <span className="stats__count">{values.genres}</span>
          </span>
        </div>
      );
    }
  }
}

export { Stats };
