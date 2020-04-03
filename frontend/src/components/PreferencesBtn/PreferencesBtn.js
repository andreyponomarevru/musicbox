import React, { Component } from "react";
import PropTypes from "prop-types";
import Icon from "../Icon/Icon";
import "./PreferencesBtn.scss";
import Modal from "../Modal/Modal";

class PreferencesBtn extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = { modal: false };
  }

  handleClick(e) {
    if (e.target === e.eventTarget) {
      console.log("Close window");
    }
    console.log(e.target);
    //e.stopPropagation();

    this.setState((state, props) => {
      return { modal: !state.modal };
    });
    console.log(this.state);
  }

  render() {
    return (
      <>
        <Icon
          className="PreferencesBtn"
          nameInSprite="preferences"
          handler={this.handleClick}
        />
        {this.state.modal ? (
          <Modal className="Modal" handler={this.handleClick}>
            Preferences Content
          </Modal>
        ) : null}
        ;
      </>
    );
  }

  static propTypes = {
    className: PropTypes.string
  };
}

export default PreferencesBtn;
