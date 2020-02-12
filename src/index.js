import React, { Component } from "react";
import ReactDOM from "react-dom";
import App from "./components/App/App";
import tracks from "./api/tracks-json";
import sidebarMenuItems from "./api/sidebar-json"


ReactDOM.render(
  <App tracks={tracks} sidebarMenuItems={sidebarMenuItems} />,
  document.getElementById('root')
);
