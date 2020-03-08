import React, { Component } from "react";
import PropTypes from "prop-types";
import "./FilterBar.scss";
import FilterBarHeader from "../FilterBarHeader/FilterBarHeader";
import FilterBarSelect from "../FilterBarSelect/FilterBarSelect";

class FilterBar extends Component {
  constructor(props) {
    super(props);
    this.handleSortBtnClick = this.handleSortBtnClick.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);

    this.state = {
      options: this.props.options,
      sort: "down",
      filterText: ""
    };
  }

  handleSearchInputChange(inputText) {
    this.setState(
      {
        filterText: inputText
      },
      () => console.log(this.state.filterText)
    );
  }

  handleSortBtnClick(e) {
    this.setState(state => {
      if (state.sort === "down") {
        return {
          options: []
            .concat(state.options)
            .sort()
            .reverse(),
          sort: "up"
        };
      } else {
        return {
          options: [].concat(state.options).sort(),
          sort: "down"
        };
      }
    }, console.log(this.state));
  }

  render() {
    const filterText = new RegExp(`^${this.state.filterText}`, "i");

    return (
      <section
        className={`${this.props.className} ${this.props.className}_type_${this.props.name}`}
      >
        <FilterBarHeader
          theme={this.context}
          filterText={this.state.filterText}
          name={this.props.name}
          className="FilterBarHeader"
          onSortBtnClick={this.handleSortBtnClick}
          onInputChange={this.handleSearchInputChange}
        />
        <FilterBarSelect
          name={this.props.name}
          className="FilterBarSelect"
          options={this.state.options.filter(option => filterText.test(option))}
          onSelectChange={this.props.onSelectChange}
        />
      </section>
    );
  }

  static propTypes = {
    selected: PropTypes.object,
    onSelectChange: PropTypes.func,
    options: PropTypes.array,
    name: PropTypes.string,
    className: PropTypes.string
  };
}

export default FilterBar;
