import React, { Component } from "react";

import icons from "./../../components-img/icons.svg";
import "./GroupingBtn.scss";

interface GroupingBtnProps extends React.HTMLAttributes<HTMLDivElement> {
  active: boolean;
  onBtnClick: () => void;
  iconName: "grid" | "list";
}
interface GroupingBtnState {
  active: boolean;
}

class GroupingBtn extends Component<GroupingBtnProps, GroupingBtnState> {
  constructor(props: GroupingBtnProps) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onBtnClick();
  }

  render() {
    const { iconName, active } = this.props;

    const className = active
      ? `grouping-btn__icon grouping-btn__icon_active`
      : `grouping-btn__icon`;

    return (
      <div className="layout-btn">
        <svg className={className} onClick={this.handleClick}>
          <use href={`${icons}#${iconName}`} />
        </svg>
      </div>
    );
  }
}

export { GroupingBtn };
