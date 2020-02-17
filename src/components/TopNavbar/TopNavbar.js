import React, { Component } from "react";
import PropTypes from "prop-types";

import "./TopNavbar.scss";

import AppLogo from "../AppLogo/AppLogo";
import Searchbar from "../Searchbar/Searchbar";

class TopNavbar extends Component {
  render() {
    return (
      <section className="TopNavbar">
        <AppLogo className="AppLogo" />
        <div className="Options" />
        <Searchbar className="Searchbar" />
        <div className="Icons" />
      </section>
    );
  }
}

TopNavbar.propTypes = {
  className: PropTypes.string
};

export default TopNavbar;
