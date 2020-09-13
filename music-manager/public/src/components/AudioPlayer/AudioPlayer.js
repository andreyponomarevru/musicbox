import React, { Component } from "react";
import PropTypes from "prop-types";

import "./AudioPlayer.scss";

class AudioPlayer extends Component {
  render() {
    return <div className={this.props.className}></div>;
  }
}

AudioPlayer.propTypes = {
  className: PropTypes.string
};

export default AudioPlayer;
