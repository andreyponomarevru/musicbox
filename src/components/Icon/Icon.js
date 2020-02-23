import React, { Component } from "react";
import PropTypes from "prop-types";

import "./Icon.scss";
import icons from "./svg-icons";

class Icon extends Component {
  constructor(props) {
    super(props);
    this.name = props.name;
    this.height = props.height;
  }

  render() {
    return (
      <svg viewBox="0 0 14 14" className="Icon" height={this.height}>
        <path d={icons[this.name]} />
      </svg>
    );
  }

  static defaultProps = {
    height: "1.4em"
  };

  static propTypes = {
    height: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string
  };
}

export default Icon;
