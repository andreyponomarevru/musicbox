import React from "react";

import icons from "./../icons.svg";
import "./select-view-btn.scss";
import { Layout } from "../../types";
import { State as LayoutState } from "../../state/useLayout";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  layout: LayoutState;
  handleBtnClick?: () => void;
  disabled?: boolean;
}

export function SelectViewBtn(props: Props): JSX.Element {
  const iconClassName = props.layout.disableControls
    ? "select-view-btn__icon_disabled"
    : "";

  return (
    <button className="select-view-btn" disabled={props.layout.disableControls}>
      <svg
        className={`select-view-btn__icon ${iconClassName}`}
        onClick={props.handleBtnClick}
      >
        <use
          href={`${icons}#${props.layout.name === "grid" ? "list" : "grid"}`}
        />
      </svg>
    </button>
  );
}
