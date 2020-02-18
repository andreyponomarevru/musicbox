import React, { Component } from "react";
import PropTypes from "prop-types";

import Icon from "../Icon/Icon";
import "./ReleasesGrid.scss";

class ReleasesGrid extends Component {
  render() {
    return (
      <div className={this.props.className}>
        <Icon name="ArrowDown" />
      </div>
    );
  }

  static propTypes = {
    className: PropTypes.string
  };
}

export default ReleasesGrid;

/*
        <Icon name="KebabBalls" href="http://google.com" />
        <Icon name="Guitar" href="http://www.github.io" height="22px" />
        <Icon name="Heart" href="http://www.github.io" />
        <Icon name="SolidArrowDown" href="http://www.github.io" height="10px" />
        
        <Icon name="Cog" href="http://www.github.io" height="20px" />
        <Icon name="Folder" href="http://www.github.io" height="17px" />
*/
