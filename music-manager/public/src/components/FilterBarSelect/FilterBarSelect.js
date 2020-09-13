/* eslint-disable jsx-a11y/no-onchange */
import React, { Component } from "react";
import PropTypes from "prop-types";
import "./FilterBarSelect.scss";

class FilterBarSelect extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = { value: ["All"] };
  }

  // this method handles only the single FilterBarSelect component
  //
  // FIX: possibly I don't need such a verbouse function, cause I dont use its
  // results. All <select> processing happens in <App> event handlers
  handleChange(e) {
    const selectedOption = e.target.value;

    function updateSelectedOptions(state) {
      const selectedOptions = state.value;
      const isSelected = selectedOptions.includes(selectedOption);

      const newState = {};

      if (selectedOption === "All") newState.value = [selectedOption];
      else if (selectedOptions.includes("All")) {
        newState.value = [
          ...selectedOptions.filter(option => option !== "All"),
          selectedOption
        ];
      } else if (isSelected && selectedOptions.length >= 1) {
        newState.value = selectedOptions.filter(
          option => option !== selectedOption
        );
      } else newState.value = [...selectedOptions, selectedOption];

      return newState;
    }

    this.setState(updateSelectedOptions);
    this.props.onSelectChange(e);
  }

  render() {
    /* add 'value' attr to <select> and make it updated on each click.
       You can implement this either through 'state' OR it is better to update 'value' based on props.selected passed from <App>.
       It should store all selected options */

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
        value={this.state.value}
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
    onSelectChange: PropTypes.func,
    options: PropTypes.array,
    name: PropTypes.string,
    className: PropTypes.string
  };
}

export default FilterBarSelect;
