import React, { Component } from "react";
import PropTypes from "prop-types";
import "./FilterBar.scss";
import FilterBarHeader from "../FilterBarHeader/FilterBarHeader";
import FilterBarSelect from "../FilterBarSelect/FilterBarSelect";

class FilterBar extends Component {
  constructor(props) {
    super(props);
    this.handleSortNumBtnClick = this.handleSortNumBtnClick.bind(this);
    this.handleSortStrBtnClick = this.handleSortStrBtnClick.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);

    this.state = {
      options: this.props.options,
      sort: "down",
      selected: [],
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

  handleSortNumBtnClick(e) {
    this.setState((state, props) => {
      if (state.sort === "down") {
        return {
          options: [].concat(state.options).sort((a, b) => b - a),
          selected: state.selected,
          sort: "up"
        };
      } else {
        return {
          options: [].concat(state.options).sort(),
          selected: state.selected,
          sort: "down"
        };
      }
    }, console.log(this.state));
  }

  handleSortStrBtnClick(e) {
    console.log("Sort Str!");
  }

  render() {
    // TODO
    // remove 'options' from state
    const filterText = new RegExp(`^${this.state.filterText}`, "i");

    return (
      <section
        className={`${this.props.className} ${this.props.className}_type_${this.props.name}`}
      >
        <FilterBarHeader
          filterText={this.state.filterText}
          name={this.props.name}
          className="FilterBarHeader"
          onSortNumBtnClick={this.handleSortNumBtnClick}
          onSortStrBtnClick={this.handleSortStrBtnClick}
          onInputChange={this.handleSearchInputChange}
        />
        <FilterBarSelect
          name={this.props.name}
          className="FilterBarSelect"
          options={this.state.options.filter(option => filterText.test(option))}
          selected={this.state.selected}
        />
      </section>
    );
  }

  static propTypes = {
    options: PropTypes.array,
    name: PropTypes.string,
    className: PropTypes.string
  };
}

export default FilterBar;
