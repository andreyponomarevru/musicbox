import React, { Component } from "react";
import { Route } from "react-router-dom";

import { MusicboxLogo } from "../musicbox-logo/musicbox-logo";
import { Btn } from "../btn/btn";
import { AddRelease } from "../page_add-release/add-release";
import { Main } from "../page_main/main";

import "./app.scss";

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <MusicboxLogo
          className="app__logo musicbox-logo"
          fill="black"
          height="1.5rem"
        />
        <nav className="app__controls app__controls_top">
          <Btn
            className="btn btn_theme_empty"
            href="/release/add"
            text="Add Release"
          />
        </nav>
      </header>

      <Route
        exact
        path="/"
        render={(props) => {
          return <Main className="main app__main" />;
        }}
      />
      <Route path="/release/add" component={AddRelease} />
    </div>
  );
}

export { App };
