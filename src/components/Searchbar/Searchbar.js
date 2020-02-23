import React, { Component } from "react";
import PropTypes from "prop-types";

import "./Searchbar.scss";
import SVGicons from "../Icon/svg-icons";

class Searchbar extends Component {
  render() {
    return (
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
        />
        <svg
          viewBox="0 0 3.704 3.704"
          className={`${this.props.className}__settings`}
        >
          <path d={SVGicons["Settings"]} fill="#999" />
        </svg>
      </div>
    );
  }
}

Searchbar.propTypes = {
  className: PropTypes.string
};

export default Searchbar;
