import React, { Component } from "react";

import icons from "./../../components-img/icons.svg";

interface IconProps extends React.HTMLAttributes<SVGAElement> {
  theme: string;
  nameInSprite: string;
  handler: any;
}

interface IconState {}

class Icon extends Component<IconProps, IconState> {
  render() {
    const className = this.props.className;

    return (
      <svg
        className={`${className} ${className}_theme_${this.props.theme}`}
        onClick={this.props.handler}
      >
        <use href={`${icons}#${this.props.nameInSprite}`} />
      </svg>
    );
  }
}

export default Icon;
