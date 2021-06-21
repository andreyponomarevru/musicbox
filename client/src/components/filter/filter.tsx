import React, { useState } from "react";

import "./filter.scss";
import { Arrow } from "../arrow/arrow";
import { Modal } from "../modal/modal";
import { FilterRow } from "../filter-row/filter-row";

interface Props {
  name: string;
  stats: NotPaginatedAPIResponse<Stats[]>;
  totalTracks: number;
  handleClick: (filterName: string, filterById: string) => void;
}

export function Filter(props: Props): JSX.Element | null {
  const { stats, name, totalTracks, handleClick } = props;

  const [isOpen, setIsOpen] = useState(false);

  if (!stats) return null;

  const rowsJSX = stats.results
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
        {name} ({stats.results.length})
      </h1>

      <div className="filter__content">{...rowsJSX.slice(0, 4)}</div>

      <button
        type="button"
        className="filter__more-row"
        onClick={() => setIsOpen(true)}
      >
        <span className="filter__more-text">All</span>{" "}
        <div className="filter__arrow">
          <Arrow className="filter__arrow" direction="down" />
        </div>
      </button>

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
