import React, { Component } from "react";
import PropTypes from "prop-types";
import "./ReleaseBox.scss";
import Icon from "../Icon/Icon";

class ReleaseBox extends Component {
  render() {
    return (
      <div className={this.props.className}>
        <img
          src={this.props.cover}
          className={`${this.props.className}__cover`}
        />
        <div className={`${this.props.className}__artist-name`}>
          {this.props.artistName}
        </div>
        <div className={`${this.props.className}__release-name`}>
          {this.props.releaseName}
        </div>
      </div>
    );
  }

  static propTypes = {
    artistName: PropTypes.string,
    releaseName: PropTypes.string,
    cover: PropTypes.string,
    className: PropTypes.string
  };
}

export default ReleaseBox;
