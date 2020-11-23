import React, { Component } from "react";

import { TrackMetadata, ReleaseMetadata } from "./../../types";
import { Sidebar } from "./../Sidebar/Sidebar";
import { ContentGrid } from "../ContentGrid/ContentGrid";
import { CallToAction } from "./../CallToAction/CallToAction";
import { MusicboxLogo } from "../MusicboxLogo/MusicboxLogo";
import { HeaderBar } from "./../HeaderBar/HeaderBar";
import { Stats } from "./../Stats/Stats";
import { Pagination } from "./../Pagination/Pagination";
import { SelectSort } from "./../SelectSort/SelectSort";
import { SelectNumberPerPage } from "./../SelectNumberPerPage/SelectNumberPerPage";
import { Error as ErrorHandler } from "./../Error/Error";
import { SelectLayoutBtns } from "./../SelectLayoutBtns/SelectLayoutBtns";
import { ContentList } from "./../ContentList/ContentList";
import { AddReleaseBtn } from "./../AddReleaseBtn/AddReleaseBtn";

import "./App.scss";

const { REACT_APP_API_ROOT } = process.env;

interface AppProps extends React.HTMLProps<HTMLDivElement> {}
interface AppState {
  tracksLoaded: boolean;
  tracksError: null | Error;
  tracks: TrackMetadata[];

  releasesLoaded: boolean;
  releasesError: null | Error;
  releases: ReleaseMetadata[];

  statsLoaded: boolean;
  statsError: null | Error;
  stats: {
    releases: number;
    tracks: number;
    artists: number;
    labels: number;
    genres: number;
  };

  listViewActive: boolean;
  gridViewActive: boolean;
}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      tracksLoaded: false,
      tracksError: null,
      tracks: [],

      releasesLoaded: false,
      releasesError: null,
      releases: [],

      statsLoaded: false,
      statsError: null,
      stats: {
        releases: 0,
        tracks: 0,
        artists: 0,
        labels: 0,
        genres: 0,
      },

      listViewActive: false,
      gridViewActive: true,
    };

    this.handleListBtnClick = this.handleListBtnClick.bind(this);
    this.handleGridBtnClick = this.handleGridBtnClick.bind(this);
  }

  handleListBtnClick() {
    this.getTracks();
    this.getStats();
    this.setState({ listViewActive: true, gridViewActive: false });
  }

  handleGridBtnClick() {
    this.getReleases();
    this.getStats();
    this.setState({ listViewActive: false, gridViewActive: true });
  }

  getTracks() {
    fetch(`${REACT_APP_API_ROOT}/tracks`)
      .then((res) => res.json())
      .then((res) => {
        if (res.hasOwnProperty("errorCode")) throw new Error(res.message);
        else return res;
      })
      .then(
        (res) => {
          console.log(res);
          this.setState({ tracks: res.tracks, tracksLoaded: true });
        },
        (tracksError) => this.setState({ tracksLoaded: true, tracksError })
      );
  }

  getReleases() {
    fetch(`${REACT_APP_API_ROOT}/releases`)
      .then((res) => res.json())
      .then((res) => {
        if (res.hasOwnProperty("errorCode")) throw new Error(res.message);
        else return res;
      })
      .then(
        (res) => {
          console.log(res);
          this.setState({ releases: res.releases, releasesLoaded: true });
        },
        (releasesError) =>
          this.setState({ releasesLoaded: true, releasesError })
      );
  }

  getStats() {
    fetch(`${REACT_APP_API_ROOT}/stats`)
      .then((res) => res.json())
      .then((res) => {
        if (res.hasOwnProperty("errorCode")) throw new Error(res.message);
        else return res;
      })
      .then(
        (res) => this.setState({ statsLoaded: true, stats: res.stats }),
        (statsError) => this.setState({ statsLoaded: true, statsError })
      );
  }

  componentDidMount() {
    this.getReleases();
    this.getStats();
  }

  render() {
    const {
      statsError,
      statsLoaded,
      tracksError,
      tracksLoaded,
      releasesError,
      releasesLoaded,
      listViewActive,
      gridViewActive,
    } = this.state;

    let Content;
    if (listViewActive) {
      Content = <ContentList tracks={this.state.tracks} />;
    } else if (gridViewActive) {
      Content = <ContentGrid releases={this.state.releases} />;
    }

    if (statsError || tracksError || releasesError)
      return [statsError, tracksError, releasesError]
        .filter((e) => e !== null)
        .map((err) => (err ? <ErrorHandler errorMsg={err.message} /> : ""));
    else if (!statsLoaded || !releasesLoaded) return <div>Loading...</div>;
    else {
      return (
        <div className="app">
          <MusicboxLogo
            className="app__logo musicbox-logo"
            fill="black"
            height="1.5rem"
          />
          <HeaderBar className="header-bar app__header-bar">
            <AddReleaseBtn
              className="header-bar__add-release-btn add-release-btn add-release-btn_theme_empty"
              href="/release/add"
            />
          </HeaderBar>
          <Sidebar
            className="sidebar app__sidebar"
            tracksInLib={this.state.stats.tracks}
          />
          <Stats
            loaded={this.state.statsLoaded}
            error={this.state.statsError}
            values={this.state.stats}
            className="stats app__stats"
          />
          <CallToAction className="call-to-action app__call-to-action" />
          <nav className="app__nav app__nav_top">
            <Pagination
              limit={`${this.state.tracks.length} of ${this.state.stats.tracks} current selectBox value`}
            />
            <div className="app__controls app__controls_top">
              <SelectSort />
              <SelectNumberPerPage />
              <SelectLayoutBtns
                className="sort app__sort"
                onListBtnClick={this.handleListBtnClick}
                listViewActive={this.state.listViewActive}
                onGridBtnClick={this.handleGridBtnClick}
                gridViewActive={this.state.gridViewActive}
              />
            </div>
          </nav>
          {Content}
          <nav className="app__nav app__nav_bottom">
            <Pagination limit={"current selectBox value"} />
            <div className="app__controls app__controls_bottom">
              <SelectNumberPerPage />
            </div>
          </nav>
        </div>
      );
    }
  }
}

export { App };
