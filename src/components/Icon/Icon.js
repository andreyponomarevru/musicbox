import React, { Component } from "react";
import PropTypes from "prop-types";
import { createElement, StyleSheet } from "react";

import "./Icon.scss";
import sprite from "./icons.svg";

const icons = {
  KebabBallsVertical:
    "M1.522 3.086a.33.33 0 00.33.33.33.33 0 00.33-.33.33.33 0 00-.33-.33.33.33 0 00-.33.33zm0-1.25a.33.33 0 00.33.33.33.33 0 00.33-.33.33.33 0 00-.33-.33.33.33 0 00-.33.33zm0-1.217a.33.33 0 00.33.33.33.33 0 00.33-.33.33.33 0 00-.33-.331.33.33 0 00-.33.33z",
  ArrowDown:
    "M1.962 2.52l.946-.953a.162.162 0 000-.228.16.16 0 00-.227 0l-.841.845-.841-.845a.16.16 0 00-.227 0 .162.162 0 000 .228l.946.952a.159.159 0 00.122.047.167.167 0 00.122-.047z"
};

class Icon extends Component {
  constructor(props) {
    super(props);
    this.name = props.name;
    this.fill = props.fill;
    this.height = props.height;
  }

  render() {
    return (
      <svg
        viewBox="0 0 3.704 3.704"
        className={`Icon Icon__${this.name}`}
        height={this.height}
      >
        <path d={icons[this.name]} fill={this.fill} />
      </svg>
    );
  }

  static defaultProps = {
    fill: "#999",
    height: "1.4em"
  };

  static propTypes = {
    height: PropTypes.string,
    fill: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string
  };
}

export default Icon;
