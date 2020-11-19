import React, { Component, useImperativeHandle } from "react";

import { TrackMetadata, ReleaseMetadata } from "./../../types";
import { Filter } from "./../Filter/Filter";
import { Content } from "./../Content/Content";
import { Navigation } from "./../Navigation/Navigation";
import { CallToAction } from "./../CallToAction/CallToAction";
import { AppLogo } from "./../AppLogo/AppLogo";
import { HeaderBar } from "./../HeaderBar/HeaderBar";
import { Stats } from "./../Stats/Stats";

import "./App.scss";

const { REACT_APP_API_ROOT } = process.env;

interface AppProps extends React.HTMLProps<HTMLDivElement> {}
interface AppState {
  releases: ReleaseMetadata[];
  tracks: TrackMetadata[];
}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = { releases: [], tracks: [] };
  }

  getTracksByPage() {
    fetch(`${REACT_APP_API_ROOT}/releases`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        this.setState({ releases: res.releases });
      })
      .catch((err) => {
        console.error(err);
        //this.setState({ genresIsLoaded: true, genresError: error });
      });
  }

  componentDidMount() {
    this.getTracksByPage();
  }

  render() {
    return (
      <div className={this.props.className}>
        <AppLogo className="app-logo" fill="black" height="1.5rem" />
        <HeaderBar className="header-bar" />
        <Filter className="filter" />
        <Stats className="stats" />
        <CallToAction className="call-to-action" />
        <Navigation className="navigation" />
        <Content className="content" releases={this.state.releases} />
      </div>
    );
  }
}

export { App };
