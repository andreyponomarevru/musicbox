import React, { Component } from "react";
import PropTypes from "prop-types";

import icons from "./../../img/icons.svg";

class Icon extends Component {
  render() {
    return (
      <svg className={`${this.props.className}`} onClick={this.props.handler}>
        <use href={`${icons}#${this.props.nameInSprite}`} />
      </svg>
    );
  }

  /*
  static defaultProps = {
    height: "1.4em"
  };
  */
  static propTypes = {
    handler: PropTypes.func,
    nameInSprite: PropTypes.string,
    className: PropTypes.string
  };
}

export default Icon;
