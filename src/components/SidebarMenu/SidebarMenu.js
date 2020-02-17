import React, { Component } from "react";
import PropTypes from "prop-types";
import CollapsibleMenu from "../CollapsibleMenu/CollapsibleMenu";

import ".//SidebarMenu.scss";

class SidebarMenu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const keys = Object.keys(this.props.items);
    const menuItems = keys.map((name, index) => (
      <CollapsibleMenu name={name} key={index} items={this.props.items[name]} />
    ));

    return <section className={this.props.className}>{menuItems}</section>;
  }
}

SidebarMenu.propTypes = {
  items: PropTypes.object,
  className: PropTypes.string
};

export default SidebarMenu;
