import React, { Component } from "react";

import "./FilterRowCounter.scss";

interface FilterRowCounterProps extends React.HTMLAttributes<HTMLDivElement> {
  count: number;
  tracksInLib: number;
}
interface FilterRowCounterState {
  isLoaded: boolean;
  error: null | Error;
  width: number;
}

class FilterRowCounter extends Component<
  FilterRowCounterProps,
  FilterRowCounterState
> {
  constructor(props: FilterRowCounterProps) {
    super(props);
    this.state = { isLoaded: false, error: null, width: 0 };
  }

  componentDidMount() {
    const minDivWidth = 1;
    const tracksInLibTotal = this.props.tracksInLib;

    const divWidth = document.querySelector(".filter-row-counter")!.clientWidth;
    const tracksPercent = (this.props.count * 100) / tracksInLibTotal;
    const fillWidth = (tracksPercent * divWidth) / 100;

    this.setState({ isLoaded: true, width: fillWidth + minDivWidth });
  }

  render() {
    const { error, isLoaded } = this.state;

    if (error) {
      return (
        <span className="filter-row-counter filter-row-counter_state_error">
          <span className="filter-row-counter__number">{this.props.count}</span>
          <span className="filter-row-counter__bg filter-row-counter__bg_state_loading">
            {error.message}
          </span>
        </span>
      );
    } else if (!isLoaded) {
      return (
        <span className="filter-row-counter">
          <span className="filter-row-counter__number">{this.props.count}</span>
          <span className="filter-row-counter__bg filter-row-counter__bg_state_loading">
            Loading...
          </span>
        </span>
      );
    } else if (this.state.width > 0) {
      return (
        <span className="filter-row-counter">
          <span className="filter-row-counter__number">{this.props.count}</span>
          <span
            className="filter-row-counter__bg"
            style={{ width: `${this.state.width}%` }}
          ></span>
        </span>
      );
    } else {
      return (
        <span className="filter-row-counter filter-row-counter_state_error">
          <span className="filter-row-counter__number">{this.props.count}</span>
        </span>
      );
    }
  }
}

export { FilterRowCounter };
