import React, { Component } from "react";
import PropTypes from "prop-types";
import "./FilterBar.scss";
import FilterBarHeader from "../FilterBarHeader/FilterBarHeader";
import FilterBarSelect from "../FilterBarSelect/FilterBarSelect";

import tracks from "./../../api/tracks-json";

class FilterBar extends Component {
  render() {
    switch (this.props.name) {
      case "Year":
        return (
          <section
            className={`${this.props.className} ${this.props.className}_type_${this.props.name}`}
          >
            <FilterBarHeader
              name={this.props.name}
              className="FilterBarHeader"
            />

            <FilterBarSelect
              name={this.props.name}
              className="FilterBarSelect"
              tracks={tracks}
            />
          </section>
        );

      default:
        return (
          <section
            className={`${this.props.className} ${
              this.props.className
            }_type_${this.props.name.toLowerCase()}`}
          >
            <FilterBarHeader
              name={this.props.name}
              className="FilterBarHeader"
            />
            <FilterBarSelect
              name={this.props.name}
              className="FilterBarSelect"
            />
          </section>
        );
    }
  }

  static propTypes = {
    name: PropTypes.string,
    className: PropTypes.string
  };
}

export default FilterBar;
