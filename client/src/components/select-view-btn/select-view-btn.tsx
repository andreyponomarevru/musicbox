import React from "react";

import icons from "./../icons.svg";
import "./select-view-btn.scss";
import { Layout } from "../../types";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  active: boolean;
  handleBtnClick: () => void;
  iconName: Layout;
}

export function SelectViewBtn(props: Props) {
  const className = props.active
    ? `select-view-btn__icon select-view-btn__icon_active`
    : `select-view-btn__icon`;

  return (
    <div className="layout-btn">
      <svg className={className} onClick={props.handleBtnClick}>
        <use href={`${icons}#${props.iconName}`} />
      </svg>
    </div>
  );
}
