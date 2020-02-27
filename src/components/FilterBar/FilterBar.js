import React, { Component } from "react";
import PropTypes from "prop-types";
import "./FilterBar.scss";
import FilterBarHeader from "../FilterBarHeader/FilterBarHeader";
import FilterBarSelect from "../FilterBarSelect/FilterBarSelect";

import tracks from "./../../api/tracks-json";

class FilterBar extends Component {
  constructor(props) {
    super(props);
    this.handleIconClick = this.handleIconClick.bind(this);
  }

  handleIconClick(e) {
    console.log("works");
  }

  render() {
    return (
      <section
        className={`${this.props.className} ${this.props.className}_type_${this.props.name}`}
      >
        <FilterBarHeader 
          name={this.props.name} 
          className="FilterBarHeader" 
          onIconClick={this.handleIconClick}
        />
        <FilterBarSelect
          name={this.props.name}
          className="FilterBarSelect"
          tracks={tracks}
        />
      </section>
    );
  }

  static propTypes = {
    name: PropTypes.string,
    className: PropTypes.string
  };
}

export default FilterBar;
