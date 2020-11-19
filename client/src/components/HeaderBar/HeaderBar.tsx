import React, { Component } from "react";
import { AddReleaseBtn } from "../AddReleaseBtn/AddReleaseBtn";

import "./HeaderBar.scss";

interface HeaderBarProps extends React.HTMLAttributes<HTMLDivElement> {}
interface HeaderBarState {}

class HeaderBar extends Component<HeaderBarProps, HeaderBarState> {
  render() {
    return (
      <div className={this.props.className}>
        <AddReleaseBtn className="add-release-btn add-release-btn_theme_empty" />
      </div>
    );
  }
}

export { HeaderBar };
