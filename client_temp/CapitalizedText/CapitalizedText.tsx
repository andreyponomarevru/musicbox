import React, { Component } from "react";
import PropTypes from "prop-types";

class CapitalizedText extends Component {
  firstToCap(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  render() {
    return this.firstToCap(this.props.text);
  }

  static propTypes = {
    text: PropTypes.string
  };
}

export default CapitalizedText;
