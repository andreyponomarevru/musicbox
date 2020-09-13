import React, { Component } from "react";
import PropTypes from "prop-types";

import Icon from "../Icon/Icon";
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
      <React.Fragment>
        <a href="#" className="link" onClick={this.toggleMenu}>
          <span className="CollapsibleMenu">
            {this.props.name.toUpperCase()}
            <Icon name="KebabBallsVertical" />
          </span>
        </a>
        {this.state.isVisible ? this.getSubCollapsibleMenus() : null}
      </React.Fragment>
    );
  }

  static propTypes = {
    name: PropTypes.string,
    subCollapsibleMenus: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ])
  };
}

export default CollapsibleMenu;
