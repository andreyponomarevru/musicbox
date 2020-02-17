import React, { Component } from "react";
import PropTypes from "prop-types";

import logo from "../../img/logo.svg";

function AppLogo(props) {
  return <img src={logo} alt="MusicBox" className={props.className} />;
}

AppLogo.propTypes = {
  className: PropTypes.string
};

export default AppLogo;
