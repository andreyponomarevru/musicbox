import React, { Component, useState } from "react";

import "./filter-row.scss";
import { FilterRowCounter } from "../filter-row-counter/filter-row-counter";

interface Props {
  totalTracksInCategory: number;
  totalTracksInLib: number;
  name: string;
  handleClick: (filter: string) => void;
  id: any;
  filterName: string;
}

export function FilterRow(props: Props) {
  async function onClick() {
    console.log("!!!");
    console.log(props.filterName);
    await props.handleClick(props.id);
  }

  return (
    <li className="filter-row" onClick={onClick}>
      <span className="filter-row__name">{props.name}</span>
      <FilterRowCounter
        totalTracksInCategory={props.totalTracksInCategory}
        totalTracksInLib={props.totalTracksInLib}
      />
    </li>
  );
}
