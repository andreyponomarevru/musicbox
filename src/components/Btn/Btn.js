import React, { Component } from "react";
import PropTypes from "prop-types";

import "./Btn.scss";

class Btn extends Component {
  render() {
    return (
      <div type="button" className={this.props.className}>
        Click me!
      </div>
    );
  }
}

Btn.propTypes = {
  className: PropTypes.string
};

export default Btn;
