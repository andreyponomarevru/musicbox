import React, { Component } from "react";

import icons from "./../../components-img/icons.svg";
import "./SelectLayoutBtns.scss";

interface SelectLayoutBtnsProps extends React.HTMLAttributes<HTMLDivElement> {
  listViewActive: boolean;
  gridViewActive: boolean;
  onListBtnClick: () => void;
  onGridBtnClick: () => void;
}
interface SelectLayoutBtnsState {}

class SelectLayoutBtns extends Component<
  SelectLayoutBtnsProps,
  SelectLayoutBtnsState
> {
  constructor(props: SelectLayoutBtnsProps) {
    super(props);

    this.handleGridBtnClick = this.handleGridBtnClick.bind(this);
    this.handleListBtnClick = this.handleListBtnClick.bind(this);
  }

  handleListBtnClick() {
    this.props.onListBtnClick();
  }

  handleGridBtnClick() {
    this.props.onGridBtnClick();
  }

  render() {
    const listBtnClassName = this.props.listViewActive
      ? `select-layout__btn select-layout__btn_active`
      : `select-layout__btn`;

    const gridBtnclassName = this.props.gridViewActive
      ? `select-layout__btn select-layout__btn_active`
      : `select-layout__btn`;

    return (
      <div className="control-layout">
        <svg className={listBtnClassName} onClick={this.handleListBtnClick}>
          <use href={`${icons}#list`} />
        </svg>
        <svg className={gridBtnclassName} onClick={this.handleGridBtnClick}>
          <use href={`${icons}#grid`} />
        </svg>
      </div>
    );
  }
}

export { SelectLayoutBtns };
