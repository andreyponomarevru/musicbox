import React, { Component } from "react";
import ReactDOM from "react-dom";
import { hot } from "react-hot-loader/root";

import "./components/reset.scss";
import "./components/page/page.scss";
import "./components/link/link.scss";
import "./components/Scrollbar/Scrollbar.scss";

import App from "./components/App/App";

ReactDOM.render(<App className="App" />, document.getElementById("root"));

export default hot(App);