import React, { Component, useState, useEffect } from "react";

import "./filter-row-counter.scss";
import { Loader } from "../loader/loader";

interface FilterRowCounterProps extends React.HTMLAttributes<HTMLDivElement> {
  totalTracksInLib: number;
  totalTracksInCategory: number;
}

export function FilterRowCounter(props: FilterRowCounterProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const minFilledWidth = 1;
    const counterEl = document.querySelector(".filter-row-counter");

    const fullWidth = counterEl!.clientWidth;
    const filledWidth =
      (props.totalTracksInCategory / props.totalTracksInLib) * fullWidth;

    setWidth(filledWidth + minFilledWidth);
  });

  return (
    <span className="filter-row-counter">
      <span className="filter-row-counter__number">
        {props.totalTracksInCategory}
      </span>
      <span
        className="filter-row-counter__bg"
        style={{ width: `${width}%` }}
      ></span>
    </span>
  );
}
