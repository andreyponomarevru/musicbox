import React, { Component } from "react";

class MenuItem extends Component {
  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.state = {
      isVisible: false
    }    
  } 

  toggleMenu(e, index) {
    console.log(index, this.props.submenuItems);
    this.setState(state => {
      return {
        isVisible: !state.isVisible
      }
    });
  }

  render() {
    console.log(this.state.isVisible)
    if (this.state.isVisible) {
      const submenuItems = this.props.submenuItems.map((name, index) => {
        return (
          <div key={index} className="submenuItem">{name}</div>
        );
      });

      return (
        <div className="menuItem">
          <a href="#" onClick={(e) => this.toggleMenu(e, this.props.index)}>{this.props.name.toUpperCase()}</a>
          <a href="#" className="btn">...</a>
          {submenuItems}
        </div>
      );
    } else {
      return (
        <div className="menuItem">
          <a href="#" onClick={(e) => this.toggleMenu(e, this.props.index)}>{this.props.name.toUpperCase()}</a>
          <a href="#" className="btn">...</a>
        </div>
      );
    }



  }
}

export default MenuItem;