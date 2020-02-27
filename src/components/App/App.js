import React, { Component } from "react";
import PropTypes from "prop-types";

import sidebarMenuItems from "../../api/sidebar-json";

import "./App.scss";

import HeaderBar from "../HeaderBar/HeaderBar";
import SidebarMenu from "../SidebarMenu/SidebarMenu";
import FilterBar from "./../FilterBar/FilterBar";
import ReleasesGrid from "./../ReleasesGrid/ReleasesGrid";
import AudioPlayer from "./../AudioPlayer/AudioPlayer";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.className}>
        <HeaderBar className="HeaderBar" />
        <SidebarMenu className="SidebarMenu" items={sidebarMenuItems} />
        <FilterBar className="FilterBar" name="year" />
        <FilterBar className="FilterBar" name="genre" />
        <FilterBar className="FilterBar" name="artist" />
        <FilterBar className="FilterBar" name="album" />
        <FilterBar className="FilterBar" name="label" />
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
