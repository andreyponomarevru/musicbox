import React, { Component } from "react";

import icons from "./../../components-img/icons.svg";
import "./LayoutBtn.scss";

interface LayoutBtnProps extends React.HTMLAttributes<HTMLDivElement> {
  active: boolean;
  onLayoutBtnClick: () => void;
  iconName: "grid" | "list";
}
interface LayoutBtnState {}

class LayoutBtn extends Component<LayoutBtnProps, LayoutBtnState> {
  constructor(props: LayoutBtnProps) {
    super(props);

    this.handleLayoutBtnClick = this.handleLayoutBtnClick.bind(this);
  }

  handleLayoutBtnClick() {
    this.props.onLayoutBtnClick();
  }

  render() {
    const className = this.props.active
      ? `layout-btn__icon layout-btn__icon_active`
      : `layout-btn__icon`;

    return (
      <div className="layout-btn">
        <svg className={className} onClick={this.handleLayoutBtnClick}>
          <use href={`${icons}#${this.props.iconName}`} />
        </svg>
      </div>
    );
  }
}

export { LayoutBtn };
