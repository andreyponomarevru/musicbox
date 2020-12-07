import React, { Component } from "react";
import PropTypes from "prop-types";

import "./Searchbar.scss";
import Icon from "../Icon/Icon";

class Searchbar extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    if (e.target.value.length === 1) {
      if (e.target.value == "F") {
        console.log(
          "Request releases starting with 'F' from database and output them in overlay"
        );
      }
    }
    this.setState({ value: e.target.value });
  }

  handleSubmit(e) {
    console.log(`"${this.state.value}" sent to the server`);
    e.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className={this.props.className}>
          <label
            htmlFor="search"
            className={`${this.props.className}__label`}
          ></label>
          <input
            id="search"
            type="text"
            name="search"
            className={`${this.props.className}__input`}
            placeholder="Search albums, artists and more ..."
            value={this.state.value}
            onChange={this.handleChange}
          />
          <Icon
            className={`${this.props.className}__settings-icon`}
            nameInSprite="settings"
            onClick={this.handleSettingsIconClick}
          />
        </div>
      </form>
    );
  }
}

Searchbar.propTypes = {
  className: PropTypes.string,
};

export default Searchbar;
