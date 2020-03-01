import React, { Component } from "react";
import PropTypes from "prop-types";
import "./SortOptionsBtn.scss";
import Icon from "../Icon/Icon";

class SortOptionsBtn extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = { arrowDirection: "down" };
  }

  handleClick() {
    this.props.onSortBtnClick();
    console.log("Change arrow direction");
    this.setState((state, props) => {
      return {
        arrowDirection: state.arrowDirection === "down" ? "up" : "down"
      };
    }, console.log(this.state));
  }

  render() {
    const className =
      this.state.arrowDirection === "down"
        ? this.props.className
        : `${this.props.className} ${this.props.className}_rotate_up`;
    return (
      <Icon
        className={className}
        nameInSprite="arrow-down-solid"
        handler={this.handleClick}
      />
    );
  }

  static propTypes = {
    onSortBtnClick: PropTypes.func,
    className: PropTypes.string
  };
}

export default SortOptionsBtn;
