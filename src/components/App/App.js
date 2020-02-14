import React, { Component } from "react";

import sidebarMenuItems from "../../api/sidebar-json";

import Sidebar from "../Sidebar/Sidebar";
import Btn from "../Btn/Btn";
import Select from "../Select";
import AppLogo from "../AppLogo/AppLogo";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    /*
    const tracksList = this.props.tracks.map((track, index) => {
      return (
        <p key={index}>{track.artist} — {track.title}</p>
      );
    });
    */

    return (
      <div>
        <AppLogo />
        <Sidebar sidebarMenuItems={sidebarMenuItems} className="sidebar" />
        <Btn className="btn btn_theme_black" />
        <Select />
      </div>
    );
  }
}

export default App;
