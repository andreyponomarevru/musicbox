import React, { Component } from "react";
import ReactDOM from "react-dom";
import { hot } from "react-hot-loader/root";
import App from "./components/App/App";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

// Global styles
import "./components/reset.scss";
import "./components/page/page.scss";
import "./components/link/link.scss";
import "./components/Scrollbar/Scrollbar.scss";

const rootEl = document.getElementById("root");

ReactDOM.render(
  <ErrorBoundary>
    <App className="App" theme="white" />
  </ErrorBoundary>,
  rootEl
);

export default hot(App);
