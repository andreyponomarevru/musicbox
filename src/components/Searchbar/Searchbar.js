import React, { Component } from "react";
import PropTypes from "prop-types";

import "./Searchbar.scss";

class Searchbar extends Component {
  render() {
    return (
      <div className={this.props.className}>
        <label 
        htmlFor="search" 
        className={this.props.className + "__label" + " " + this.props.className + "__input_type_search"}></label>
        <input
          id="search"
          type="text"
          name="search"
          className={this.props.className + "__input"}
          placeholder="Search albums, artists and more ..."
        />
      </div>
    );
  }
}

Searchbar.propTypes = {
  className: PropTypes.string
};

export default Searchbar;
