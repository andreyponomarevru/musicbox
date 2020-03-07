import React, { Component } from "react";
import PropTypes from "prop-types";
import "./FilterSearchBar.scss";
import FilterSearchBtn from "../FilterSearchBtn/FilterSearchBtn";

class FilterSearchBar extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputSubmit = this.handleInputSubmit.bind(this);
    this.handleSearchBtnClick = this.handleSearchBtnClick.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.state = { isInputVisible: false };
  }

  handleBlur(e) {
    // if there no text left in input - hide it. Otherwise keep it visible
    if (e.target.value === "") {
      this.setState(state => {
        return { isInputVisible: !state.isInputVisible };
      });
    }
  }

  handleSearchBtnClick(e) {
    this.setState(state => {
      return { isInputVisible: !state.isInputVisible };
    });
  }

  handleInputChange(e) {
    this.props.onInputChange(e.target.value);
  }

  handleInputSubmit(e) {
    e.preventDefault();
  }

  render() {
    const input = (
      <input
        type="text"
        name={this.props.name}
        className={`${this.props.className}__input`}
        value={this.props.filterText}
        onChange={this.handleInputChange}
        onBlur={this.handleBlur}
      />
    );

    return (
      <form
        action="."
        method="post"
        className={this.props.className}
        onSubmit={this.handleInputSubmit}
      >
        <label className={`${this.props.className}__label`}>
          {this.state.isInputVisible && input}
          <FilterSearchBtn
            className="FilterSearchBtn"
            onSearchBtnClick={this.handleSearchBtnClick}
          />
        </label>
      </form>
    );
  }

  static propTypes = {
    filterText: PropTypes.string,
    onInputChange: PropTypes.func,
    name: PropTypes.string,
    className: PropTypes.string
  };
}

export default FilterSearchBar;
