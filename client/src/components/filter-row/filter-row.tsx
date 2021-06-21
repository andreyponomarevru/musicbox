import React from "react";

import "./filter-row.scss";
import { FilterRowCounter } from "../filter-row-counter/filter-row-counter";

interface Props {
  totalTracksInCategory: number;
  totalTracksInLib: number;
  name: string;
  handleClick: (filterName: string, filterById: string) => void;
  id: any;
  filterName: string;
}

export function FilterRow(props: Props) {
  async function onClick() {
    console.log(props.filterName);
    await props.handleClick(props.filterName, props.id);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className="filter-row"
      onKeyDown={onClick}
      onClick={onClick}
    >
      <span className="filter-row__name">{props.name}</span>
      <FilterRowCounter
        totalTracksInCategory={props.totalTracksInCategory}
        totalTracksInLib={props.totalTracksInLib}
      />
    </div>
  );
}
