import React, { Component } from "react";
import PropTypes from "prop-types";
import Icon from "./../Icon/Icon";
import "./FilterBarHeader.scss";
import "./../CapitalizedText/CapitalizedText";
import CapitalizedText from "./../CapitalizedText/CapitalizedText";

class FilterBarHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // different structure for the 'year' field:
    switch (this.props.name) {
      case "year":
        return (
          <div className={`${this.props.className}__sort`}>
            <CapitalizedText text={this.props.name} />
            <Icon
              nameInSprite="arrow-down-solid"
              className={`${this.props.className}__arrow-down-solid-icon`}
              onIconClick={this.props.onIconClick}
            />
          </div>
        );

      default:
        return (
          <div className={`${this.props.className}`}>
            <div className={`${this.props.className}__sort`}>
              <CapitalizedText text={this.props.name} />
              <Icon
                nameInSprite="arrow-down-solid"
                className={`${this.props.className}__arrow-down-solid-icon`}
                onIconClick={this.props.onIconClick}
              />
            </div>
            <form
              action="."
              method="post"
              className={`${this.props.className}__form`}
            >
              <label className={`${this.props.className}__label`}>
                <input
                  type="text"
                  name={this.props.name}
                  className={`${this.props.className}__input`}
                />

                <Icon
                  nameInSprite="search"
                  className={`${this.props.className}__search-icon`}
                />
              </label>
            </form>
          </div>
        );
    }
  }

  static propTypes = {
    onIconClick: PropTypes.func,
    name: PropTypes.string,
    className: PropTypes.string
  };
}

export default FilterBarHeader;
