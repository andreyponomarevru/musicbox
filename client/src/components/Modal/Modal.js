import React, { Component } from "react";
import PropTypes from "prop-types";

class Modal extends Component {
  render() {
    return (
      <div className={this.props.className} onClick={this.props.handler}>
        <div className={this.props.className + "__content"}>
          {this.props.children}
        </div>
      </div>
    );
  }

  static propTypes = {
    handler: PropTypes.func,
    children: PropTypes.node,
    className: PropTypes.string
  };
}
export default Modal;
