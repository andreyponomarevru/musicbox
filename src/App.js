import React, { Component } from "react";
import Sidebar from "./Sidebar"

class App extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const tracksList = this.props.tracks.map((track, index) => {
      return (
        <p key={index}>{track.artist} — {track.title}</p>
      );
    });

    return (
      <div>
        <Sidebar sidebarMenuItems={this.props.sidebarMenuItems} />
      </div>
    );
  }
}

export default App;