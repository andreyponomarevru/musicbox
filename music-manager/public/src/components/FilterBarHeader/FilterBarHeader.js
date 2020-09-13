import React, { Component } from "react";
import PropTypes from "prop-types";
import "./FilterBarHeader.scss";
import "./../CapitalizedText/CapitalizedText";
import CapitalizedText from "./../CapitalizedText/CapitalizedText";
import SortOptionsBtn from "./../SortOptionsBtn/SortOptionsBtn";
import FilterSearchBar from "../FilterSearchBar/FilterSearchBar";

class FilterBarHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // Different structure for the 'year' filter's header
    // (cause we dont't need the seatch bar)
    switch (this.props.name) {
      case "year":
        return (
          <div
            className={`${this.props.className} ${this.props.className}_type_year`}
          >
            <CapitalizedText text={this.props.name} />
            <SortOptionsBtn
              className="SortOptionsBtn"
              onSortBtnClick={this.props.onSortBtnClick}
            />
          </div>
        );

      default:
        return (
          <div className={`${this.props.className}`}>
            <div className={`${this.props.className}__sort`}>
              <CapitalizedText text={this.props.name} />
              <SortOptionsBtn
                className="SortOptionsBtn"
                onSortBtnClick={this.props.onSortBtnClick}
              />
            </div>
            <FilterSearchBar
              filterText={this.props.filterText}
              className="FilterSearchBar"
              onInputChange={this.props.onInputChange}
            />
          </div>
        );
    }
  }

  static propTypes = {
    onInputChange: PropTypes.func,
    onSortBtnClick: PropTypes.func,
    name: PropTypes.string,
    filterText: PropTypes.string,
    className: PropTypes.string
  };
}

export default FilterBarHeader;
