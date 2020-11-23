import React, { Component } from "react";

import "./HeaderBar.scss";

interface HeaderBarProps extends React.HTMLAttributes<HTMLDivElement> {}
interface HeaderBarState {}

class HeaderBar extends Component<HeaderBarProps, HeaderBarState> {
  render() {
    const { className = "header-bar" } = this.props;

    return <div className={className}>{this.props.children}</div>;
  }
}

export { HeaderBar };
