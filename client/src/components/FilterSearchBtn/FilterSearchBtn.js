import React, { Component } from "react";
import PropTypes from "prop-types";
import Icon from "../Icon/Icon";
import "./FilterSearchBtn.scss";
import ThemeContext from "./../App/ThemeContext";

class FilterSearchBtn extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.onSearchBtnClick();
  }

  render() {
    return (
      <Icon
        theme={this.context}
        className={this.props.className}
        nameInSprite="search"
        handler={this.handleClick}
      />
    );
  }

  static contextType = ThemeContext;

  static propTypes = {
    nameInSprite: PropTypes.string,
    onSearchBtnClick: PropTypes.func,
    className: PropTypes.string
  };
}

export default FilterSearchBtn;
