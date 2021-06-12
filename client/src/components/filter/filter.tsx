import React, { Component, useState } from "react";

import "./filter.scss";

import { Arrow } from "../arrow/arrow";
import { ResponseState } from "../../types";
import { Modal } from "../modal/modal";
import { FilterRow } from "../filter-row/filter-row";
import { Error } from "../error/error";
import { Loader } from "../loader/loader";
import { Stats } from "../../types";

interface Props {
  name: string;
  response: ResponseState<Stats[]>;
  totalTracks: number;
  handleClick: (filter: string) => void;
}

export function Filter(props: Props) {
  const { response, name, totalTracks, handleClick } = props;

  const [isOpen, setIsOpen] = useState(false);

  const rowsJSX = response.results
    .sort((a: Stats, b: Stats) => {
      if (name.toLowerCase() === "years") return 0;
      else return b.tracks - a.tracks;
    })
    .map((stats) => {
      return (
        <FilterRow
          handleClick={handleClick}
          key={stats.id}
          id={stats.id}
          totalTracksInCategory={stats.tracks}
          totalTracksInLib={totalTracks}
          name={stats.name}
          filterName={props.name.toLowerCase()}
        />
      );
    });

  return (
    <div className="filter">
      <h1 className="filter__heading">
        {name} ({response.results.length})
      </h1>

      <ul className="filter__content">{...rowsJSX.slice(0, 4)}</ul>

      <a href="#" className="filter__more-row" onClick={() => setIsOpen(true)}>
        <span className="filter__more-text">All</span>{" "}
        <div className="filter__arrow">
          <Arrow className="filter__arrow" direction="down" />
        </div>
      </a>

      <Modal
        className="modal__container_filter"
        header={name}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="filter__modal"> {rowsJSX}</div>
      </Modal>
    </div>
  );
}
