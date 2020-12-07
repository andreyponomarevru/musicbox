import React, { Component } from "react";
import { Route, NavLink, HashRouter } from "react-router-dom";

import { Sidebar } from "./../Sidebar/Sidebar";
import { CallToAction } from "./../CallToAction/CallToAction";
import { Content } from "./../Content/Content";
import { Stats } from "./../Stats/Stats";
import { Loader } from "./../Loader/Loader";

import "./Main.scss";

const { REACT_APP_API_ROOT } = process.env;

interface Props extends React.HTMLAttributes<HTMLDivElement> {}
interface State {
  statsLoaded: boolean;
  statsError: null | Error;
  stats: {
    releases: number;
    tracks: number;
    artists: number;
    labels: number;
    genres: number;
  };

  filters: null | string[];
}

class Main extends Component<Props, State> {
  private _isMounted: boolean;

  constructor(props: Props) {
    super(props);
    this._isMounted = false;
    this.state = {
      statsLoaded: false,
      statsError: null,
      stats: {
        releases: 0,
        tracks: 0,
        artists: 0,
        labels: 0,
        genres: 0,
      },

      filters: null,
    };
  }

  getStats() {
    const apiUrl = `${REACT_APP_API_ROOT}/stats`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((res) => {
        if (res.hasOwnProperty("errorCode")) {
          throw new Error(`${apiUrl}: ${res.message}`);
        } else {
          return res;
        }
      })
      .then(
        (res) => {
          if (this._isMounted) {
            this.setState({ statsLoaded: true, stats: res.stats });
          }
        },
        (statsError) => this.setState({ statsLoaded: false, statsError })
      );
  }

  componentDidMount() {
    this._isMounted = true;
    this.getStats();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { statsLoaded, statsError } = this.state;

    if (statsError) throw new Error(statsError.message);
    if (!statsLoaded) return <Loader />;

    return (
      <main className="main app__main">
        <Sidebar
          className="sidebar main__sidebar"
          tracksInLib={this.state.stats.tracks}
        />
        <Stats
          loaded={this.state.statsLoaded}
          values={this.state.stats}
          className="stats main__stats"
        />
        <CallToAction className="call-to-action main__call-to-action" />
        <Content
          filters={["artist='blue six'", "ywar=2004"]}
          stats={this.state.stats}
          className="content app__content"
        />
      </main>
    );
  }
}

export { Main };
