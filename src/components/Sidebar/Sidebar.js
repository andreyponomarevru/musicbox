import React, { Component } from "react";
import PropTypes from "prop-types";

import MenuItem from "./MenuItem";

class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const keys = Object.keys(this.props.sidebarMenuItems);
    const menuItems = keys.map((name, index) => (
      <div key={index}>
        <MenuItem
          name={name}
          index={index}
          submenuItems={this.props.sidebarMenuItems[name]}
        />
      </div>
    ));

    return <section className={this.props.className}>{menuItems}</section>;
  }
}

Sidebar.propTypes = {
  sidebarMenuItems: PropTypes.object,
  className: PropTypes.string
};

export default Sidebar;
