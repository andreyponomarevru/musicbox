import React, { Component } from "react";
import PropTypes from "prop-types";
import "./HeaderBar.scss";
import Icon from "../Icon/Icon";
import AppLogo from "../AppLogo/AppLogo";
import Searchbar from "../Searchbar/Searchbar";
import PreferencesBtn from "../PreferencesBtn/PreferencesBtn";
import HamburgerBtn from "../HamburgerBtn/HamburgerBtn";

class HeaderBar extends Component {
  render() {
    return (
      <section className="HeaderBar">
        <HamburgerBtn className="HamburgerBtn" />
        <AppLogo className="AppLogo" fill="#FFF" height="2em" />
        <Searchbar className="Searchbar" />
        <PreferencesBtn className="SettingsBtn" />
      </section>
    );
  }
}

HeaderBar.propTypes = {
  className: PropTypes.string
};

export default HeaderBar;
