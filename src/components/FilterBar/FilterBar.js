import React, { Component } from "react";
import PropTypes from "prop-types";

import "./FilterBar.scss";

class FilterBar extends Component {
  render() {
    return <div className={this.props.className}>{this.props.name}</div>;
  }
}

FilterBar.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string
};

export default FilterBar;
