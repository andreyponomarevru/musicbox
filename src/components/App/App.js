import React, { Component } from "react";
import PropTypes from "prop-types";

import sidebarMenuItems from "../../api/sidebar-json";

import "./App.scss";

import HeaderBar from "../HeaderBar/HeaderBar";
import SidebarMenu from "../SidebarMenu/SidebarMenu";
import YearsFilter from "../YearsFilter/YearsFilter";
import FiltersBar from "./../FiltersBar/FiltersBar";
import ReleasesGrid from "./../ReleasesGrid/ReleasesGrid";
import AudioPlayer from "./../AudioPlayer/AudioPlayer";

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
      <div className={this.props.className}>
        <HeaderBar className="HeaderBar" />
        <SidebarMenu className="SidebarMenu" items={sidebarMenuItems} />
        <YearsFilter className="YearsFilter" />
        <FiltersBar className="FiltersBar" />
        <ReleasesGrid className="ReleasesGrid" />
        <AudioPlayer className="AudioPlayer" />
      </div>
    );
  }
}

App.propTypes = {
  className: PropTypes.string
};

export default App;

/*        <Btn className="btn btn_theme_black" />
        <Select />*/
