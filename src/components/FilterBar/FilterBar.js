import React, { Component } from "react";
import PropTypes from "prop-types";
import Icon from "../Icon/Icon";
import "./FilterBar.scss";

class FilterBar extends Component {
  getAvailableYears() {
    // call to Db to get all existing years
    const years = [];

    for (let year = 1969; year < 2020; year++) {
      years.push(year);
    }

    return years;
  }

  render() {
    const yearsJSX = this.getAvailableYears().map((year, index) => (
      <div key={index} className={`${this.props.className}__item`}>
        <span className={`${this.props.className}__filter-value`}>{year}</span>
        <span className={`${this.props.className}__counter`}>{year}</span>
      </div>
    ));

    return (
      <section className={this.props.className}>
        <div className={`${this.props.className}__header`}>
          <div className={`${this.props.className}__sort`}>
            {this.props.name}
            <Icon name="ArrowDownSolid" />
          </div>
          <Icon name="Search" />
        </div>
        {yearsJSX}
        <div className={`${this.props.className}__shadow`} />
      </section>
    );
  }
}

FilterBar.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string
};

export default FilterBar;
