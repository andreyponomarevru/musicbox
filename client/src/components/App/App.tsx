import React, { Component } from "react";
import { Route, NavLink, HashRouter } from "react-router-dom";

import { Sidebar } from "./../Sidebar/Sidebar";
import { CallToAction } from "./../CallToAction/CallToAction";
import { MusicboxLogo } from "../MusicboxLogo/MusicboxLogo";
import { Stats } from "./../Stats/Stats";
import { Content } from "./../Content/Content";
import { AddReleaseBtn } from "./../AddReleaseBtn/AddReleaseBtn";
import { Loader } from "./../Loader/Loader";
import { AddRelease } from "./../Page_AddRelease/AddRelease";
import { Main } from "./../Page_Main/Main";

import "./App.scss";

interface AppProps extends React.HTMLProps<HTMLDivElement> {}
interface AppState {}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
  }

  render() {
    return (
      <div className="app">
        <header className="app__header">
          <MusicboxLogo
            className="app__logo musicbox-logo"
            fill="black"
            height="1.5rem"
          />
          <nav className="app__controls app__controls_top">
            <AddReleaseBtn className="add-release-btn add-release-btn_theme_empty" />
          </nav>
        </header>

        <Route exact path="/" component={Main} />
        <Route path="/release/add" component={AddRelease} />
      </div>
    );
  }
}

export { App };
