import React, { Component } from "react";
import PropTypes from "prop-types";

import "./CollapsibleMenu.scss";

class CollapsibleMenu extends Component {
  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.getSubCollapsibleMenus = this.getSubCollapsibleMenus.bind(this);
    this.state = {
      isVisible: false
    };
  }

  toggleMenu(e) {
    this.setState(state => {
      return {
        isVisible: !state.isVisible
      };
    });
  }

  getSubCollapsibleMenus() {
    const subCollapsibleMenus = this.props.subCollapsibleMenus.map(
      (name, index) => {
        return (
          <div className="MenuItem" key={index} name={name}>
            {this.props.name}
          </div>
        );
      }
    );

    return subCollapsibleMenus;
  }

  render() {
    return (
      <div className="CollapsibleMenu">
        <a href="#" className="link" onClick={this.toggleMenu}>
          {this.props.name.toUpperCase()}
        </a>
        <a href="#" className="btn-expand">
          ...
        </a>
        {this.state.isVisible ? this.getSubCollapsibleMenus() : null}
      </div>
    );
  }
}

CollapsibleMenu.propTypes = {
  name: PropTypes.string,
  subCollapsibleMenus: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

export default CollapsibleMenu;
