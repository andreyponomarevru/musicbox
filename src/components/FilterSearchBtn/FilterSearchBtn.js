import React, { Component } from "react";
import PropTypes from "prop-types";
import Icon from "../Icon/Icon";
import "./FilterSearchBtn.scss";

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
        className={this.props.className}
        nameInSprite="search"
        handler={this.handleClick}
      />
    );
  }

  static propTypes = {
    nameInSprite: PropTypes.string,
    onSearchBtnClick: PropTypes.func,
    className: PropTypes.string
  };
}

export default FilterSearchBtn;
