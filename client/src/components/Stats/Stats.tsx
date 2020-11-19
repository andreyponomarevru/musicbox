import React, { Component, useImperativeHandle } from "react";

import "./Stats.scss";
import { runInThisContext } from "vm";

interface StatsProps extends React.HTMLAttributes<HTMLDivElement> {}
interface StatsState {
  stats: {
    releases: number;
    tracks: number;
    artists: number;
    labels: number;
    genres: number;
  };
}

const { REACT_APP_API_ROOT } = process.env;

class Stats extends Component<StatsProps, StatsState> {
  constructor(props: StatsProps) {
    super(props);
    this.state = {
      stats: { releases: 0, tracks: 0, artists: 0, labels: 0, genres: 0 },
    };
  }

  componentDidMount() {
    fetch(`${REACT_APP_API_ROOT}/stats`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        this.setState({ stats: res.stats });
      })
      .catch((err) => {
        console.error(err);
        //this.setState({ genresIsLoaded: true, genresError: error });
      });
  }

  render() {
    return (
      <div className={this.props.className}>
        <span>
          <span className={`${this.props.className}__key`}>Releases</span>{" "}
          {this.state.stats.releases}
        </span>
        <span>
          <span className={`${this.props.className}__key`}>Tracks</span>{" "}
          {this.state.stats.tracks}
        </span>
        <span>
          <span className={`${this.props.className}__key`}>Artists</span>{" "}
          {this.state.stats.artists}
        </span>
        <span>
          <span className={`${this.props.className}__key`}>Labels</span>{" "}
          {this.state.stats.labels}
        </span>
        <span>
          <span className={`${this.props.className}__key`}>Genres</span>{" "}
          {this.state.stats.genres}
        </span>
      </div>
    );
  }
}

export { Stats };
