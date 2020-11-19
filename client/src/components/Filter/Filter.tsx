import React, { Component, useImperativeHandle } from "react";

import "./Filter.scss";

interface FilterProps extends React.HTMLAttributes<HTMLDivElement> {}
interface FilterState {}

class Filter extends Component<FilterProps, FilterState> {
  render() {
    return <aside className={this.props.className}>Filter</aside>;
  }
}

export { Filter };
