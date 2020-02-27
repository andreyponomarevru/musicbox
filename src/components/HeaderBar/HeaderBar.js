import React, { Component } from "react";
import PropTypes from "prop-types";

import "./HeaderBar.scss";

import Icon from "../Icon/Icon";
import AppLogo from "../AppLogo/AppLogo";
import Searchbar from "../Searchbar/Searchbar";

class HeaderBar extends Component {
  render() {
    return (
      <section className="HeaderBar">
        <Icon className="HeaderBar__hamburger-icon" nameInSprite="hamburger" />
        <AppLogo className="AppLogo" fill="#FFF" height="2em" />
        <Searchbar className="Searchbar" />
        <Icon
          className="HeaderBar__preferences-icon"
          nameInSprite="preferences"
        />
      </section>
    );
  }
}

HeaderBar.propTypes = {
  className: PropTypes.string
};

export default HeaderBar;
