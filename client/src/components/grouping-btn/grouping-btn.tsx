import React, { Component } from "react";

import icons from "./../icons.svg";
import "./grouping-btn.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  active: boolean;
  onBtnClick: () => void;
  iconName: "grid" | "list";
}

function GroupingBtn(props: Props) {
  const className = props.active
    ? `grouping-btn__icon grouping-btn__icon_active`
    : `grouping-btn__icon`;

  return (
    <div className="layout-btn">
      <svg className={className} onClick={props.onBtnClick}>
        <use href={`${icons}#${props.iconName}`} />
      </svg>
    </div>
  );
}

export { GroupingBtn };
