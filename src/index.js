import React, { Component } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import tracks from "./tracks-json";
import sidebarMenuItems from "./sidebar-json"


ReactDOM.render(
  <App tracks={tracks} sidebarMenuItems={sidebarMenuItems} />,
  document.getElementById('root')
);