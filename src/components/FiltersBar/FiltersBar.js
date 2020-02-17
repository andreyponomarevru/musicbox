import React, { Component } from "react";
import PropTypes from "prop-types";

import "./FiltersBar.scss";

import FilterBar from "./../FilterBar/FilterBar";

class FiltersBar extends Component {
  constructor(props) {
    super(props);
    this.fieldNames = ["Genre", "Artist", "Album", "Label"];
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.fieldNames.map((fieldName, index) => (
          <FilterBar className="FilterBar" name={fieldName} key={index} />
        ))}
      </div>
    );
  }
}

FiltersBar.propTypes = {
  className: PropTypes.string
};

export default FiltersBar;
