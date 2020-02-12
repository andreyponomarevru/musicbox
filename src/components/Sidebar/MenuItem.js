import React, { Component } from "react";

class Submenu extends Component {
  render() {
    return <div className="submenuItem">{this.props.name}</div>
  }
}

class MenuItem extends Component {
  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.state = {
      isVisible: false
    }    
  } 

  toggleMenu(e, index) {
    //console.log(index, this.props.submenuItems);
    this.setState(state => {
      return {
        isVisible: !state.isVisible
      }
    });
  }

  render() {
    function submenuItems() { 
      const submenuItems = this.props.submenuItems.map((name, index) => {
        return <Submenu key={index} name={name} />;
      });

      return submenuItems;
    }

    return (
      <div className="menuItem">
        <a href="#" onClick={(e) => this.toggleMenu(e)}>
          {this.props.name.toUpperCase()}
        </a>
        <a href="#" className="btn">
          ...
        </a>
        { this.state.isVisible ? submenuItems.call(this) : null }
      </div>
    );
  
  }
}

export default MenuItem;