import React, { Component } from "react";
import PropTypes from "prop-types";

class Submenu extends Component {
  render() {
    return <div className="submenuItem">{this.props.name}</div>;
  }
}

Submenu.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string
};

//

class MenuItem extends Component {
  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.state = {
      isVisible: false
    };
  }

  toggleMenu(e, index) {
    //console.log(index, this.props.submenuItems);
    this.setState(state => {
      return {
        isVisible: !state.isVisible
      };
    });
  }

  render() {
    function submenuItems() {
      const submenuItems = this.props.submenuItems.map((name, index) => {
        return <Submenu key={index} name={name} />;
      });

      return submenuItems;
    }

    const name = this.props.name.toUpperCase();

    return (
      <div className="menuItem">
        <a href="#" className="link" onClick={e => this.toggleMenu(e)}>
          {name}
        </a>
        <a href="#" className="btn-expand">
          ...
        </a>
        {this.state.isVisible ? submenuItems.call(this) : null}
      </div>
    );
  }
}

MenuItem.propTypes = {
  name: PropTypes.string,
  submenuItems: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

export default MenuItem;
