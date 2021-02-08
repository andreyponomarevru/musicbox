import React, { Component, Fragment } from "react";
import { Route, NavLink, HashRouter } from "react-router-dom";

import { Sidebar } from "../sidebar/sidebar";
import { CallToAction } from "../call-to-action/call-to-action";
import { Content } from "../content/content";
import { Stats } from "../stats/stats";
import { Loader } from "../loader/loader";

import "./main.scss";

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

  releaseDeleted: boolean;
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

      releaseDeleted: false,
    };

    this.handleDeleteReleaseBtnClick = this.handleDeleteReleaseBtnClick.bind(
      this
    );
    this.handleUpdateReleases = this.handleUpdateReleases.bind(this);
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
            this.setState({ statsLoaded: true, stats: res.results });
          }
        },
        (statsError) => this.setState({ statsLoaded: false, statsError })
      );
  }

  handleUpdateReleases() {
    this.setState({ releaseDeleted: false });
  }

  handleDeleteReleaseBtnClick(releaseId: number) {
    const apiUrl = `${REACT_APP_API_ROOT}/releases/${releaseId}`;

    fetch(apiUrl, { method: "DELETE" })
      .then((res) => {
        if (res.ok) {
          this.getStats();
          this.setState({ releaseDeleted: true });
          return res;
        } else {
          const err = `${apiUrl}: ${res.status}`;
          throw new Error(err);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  componentDidMount() {
    this._isMounted = true;
    this.getStats();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { className } = this.props;
    const { statsLoaded, statsError } = this.state;

    if (statsError) throw new Error(statsError.message);
    if (!statsLoaded) return <Loader />;

    return (
      <main className={className}>
        <Sidebar
          className="sidebar main__sidebar"
          tracksInLib={this.state.stats.tracks}
          releaseDeleted={this.state.releaseDeleted}
          handleUpdateReleases={this.handleUpdateReleases}
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
          handleDeleteReleaseBtnClick={this.handleDeleteReleaseBtnClick}
          releaseDeleted={this.state.releaseDeleted}
          handleUpdateReleases={this.handleUpdateReleases}
          handleGetStats={this.getStats}
        />
      </main>
    );
  }
}

export { Main };
