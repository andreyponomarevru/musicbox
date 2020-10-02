import React, { Component } from "react";
import PropTypes from "prop-types";
import Icon from "../Icon/Icon";
import "./HamburgerBtn.scss";

class HamburgerBtn extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log("I handle clicks on Hamburger button");
  }

  render() {
    return (
      <Icon
        className="HamburgerBtn"
        nameInSprite="hamburger"
        handler={this.handleClick}
      />
    );
  }

  static propTypes = {
    className: PropTypes.string
  };
}

export default HamburgerBtn;
