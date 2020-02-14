import React, { Component } from "react";
import ReactDOM from "react-dom";
import { hot } from "react-hot-loader/root";

import "./components/reset.scss";
import "./components/page/page.scss";
import "./components/Btn/Btn.scss";
import "./components/link/link.scss";
import "./components/Sidebar/Sidebar.scss";

import tracks from "./api/tracks-json";

import App from "./components/App/App";

ReactDOM.render(<App tracks={tracks} />, document.getElementById("root"));

export default hot(App);
