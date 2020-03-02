/* eslint-disable jsx-a11y/no-onchange */
import React, { Component } from "react";
import PropTypes from "prop-types";
import "./FilterBarSelect.scss";

class FilterBarSelect extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      selected: []
    };
  }

  handleChange(e) {
    const selectedOptions = this.state.selected;
    const isSelected = selectedOptions.includes(e.target.value);

    // Handle all selected/deselected options through this.state.selected
    if (isSelected && selectedOptions.length >= 1) {
      //const uncheckedIndex = selectedOptions.indexOf(e.target.value);

      const newState = {
        selected: selectedOptions.filter(option => option !== e.target.value)
      };
      this.setState(newState, () => console.log(this.state));
    } else {
      const newState = {
        selected: [...selectedOptions, e.target.value]
      };
      this.setState(newState, () => console.log(this.state));
    }
  }

  render() {
    const options = this.props.options.map(name => (
      <option
        value={name}
        key={name}
        className={`${this.props.className}__option`}
      >
        {name}
      </option>
    ));

    const className =
      this.props.name === "year"
        ? `${this.props.className} ${this.props.className}_type_year`
        : `${this.props.className}`;

    return (
      <select
        value={this.state.selected}
        multiple={true}
        className={className}
        onChange={this.handleChange}
        name={this.props.name}
      >
        {options}
      </select>
    );
  }

  static propTypes = {
    options: PropTypes.array,
    name: PropTypes.string,
    className: PropTypes.string
  };
}

export default FilterBarSelect;
