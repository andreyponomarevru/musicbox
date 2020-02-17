import React, { Component } from "react";
import PropTypes from "prop-types";

import "./ReleasesGrid.scss";

class ReleasesGrid extends Component {
  render() {
    return <div className={this.props.className}></div>;
  }
}

ReleasesGrid.propTypes = {
  className: PropTypes.string
};

export default ReleasesGrid;
