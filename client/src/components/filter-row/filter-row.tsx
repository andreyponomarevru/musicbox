import React, { useState, useEffect } from "react";

import "./filter-row.scss";

interface Props {
  totalTracksInCategory: number;
  totalTracksInLib: number;
  name: string;
  setFilter: (filterName: string, filterById: number) => void;
  id: number;
  filterName: string;
  appliedFilters?: number[];
}

export function FilterRow(props: Props): JSX.Element {
  const [isActive, setIsActive] = useState(false);

  async function onClick() {
    await props.setFilter(props.filterName, props.id);
    if (!isActive) setIsActive(true);
    else setIsActive(false);
  }

  const [width, setWidth] = useState(0);
  useEffect(() => {
    const minFilledWidth = 1;
    const counterEl = document.querySelector(".filter-row__counter");

    const fullWidth = counterEl?.clientWidth || 70;
    const filledWidth =
      (props.totalTracksInCategory / props.totalTracksInLib) * fullWidth;

    setWidth(filledWidth + minFilledWidth);
  }, [width, props.totalTracksInCategory, props.totalTracksInLib]);

  const isFilterApplied = props.appliedFilters?.includes(props.id);

  return (
    <div
      role="button"
      tabIndex={0}
      className={`filter-row ${isFilterApplied ? "filter-row_active" : ""}`}
      onKeyDown={onClick}
      onClick={onClick}
    >
      <span className="filter-row__name">{props.name}</span>

      <span className="filter-row__counter">
        <span className="filter-row__counter-number">
          {props.totalTracksInCategory}
        </span>
        <span
          className="filter-row__counter-bg"
          style={{ width: `${width}%` }}
        ></span>
      </span>
    </div>
  );
}
