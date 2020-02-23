import React, { Component } from "react";
import PropTypes from "prop-types";
import Icon from "../Icon/Icon";
import "./YearsFilter.scss";

class YearsFilter extends Component {
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
        {year}
      </div>
    ));

    return (
      <section className={this.props.className}>
        <div className={`${this.props.className}__header`}>
          Year
          <Icon name="ArrowDownSolid" />
        </div>
        {yearsJSX}
      </section>
    );
  }
}

YearsFilter.propTypes = {
  className: PropTypes.string
};

export default YearsFilter;
