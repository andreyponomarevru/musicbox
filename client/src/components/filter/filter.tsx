import React, { useState } from "react";

import "./filter.scss";
import { Arrow } from "../arrow/arrow";
import { Modal } from "../modal/modal";
import { FilterRow } from "../filter-row/filter-row";
import { NotPaginatedAPIResponse, Stats, FilterNames } from "../../types";

interface Props {
  name: keyof FilterNames;
  stats: NotPaginatedAPIResponse<Stats[]>;
  totalTracks: number;
  setFilter: (filterName: string, filterById: number) => void;
  appliedFilters?: number[];
  className?: string;
  resetFilter: (filter: string) => void;
}

export function Filter(props: Props): JSX.Element | null {
  const { stats, name, totalTracks, setFilter } = props;
  const { className } = props;

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
          appliedFilters={props.appliedFilters}
          setFilter={setFilter}
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
    <div className={`filter ${className}`}>
      <h1 className="filter__heading">
        <span className="filter__name">{name}</span>
        <span className="filter__counter">{stats.results.length}</span>
        <button
          onClick={() => props.resetFilter(name)}
          type="button"
          className="filter__clear-btn"
        >
          Reset
        </button>
      </h1>

      <div className="filter__content">{...rowsJSX.slice(0, 4)}</div>

      <button
        type="button"
        className="filter__more-row"
        onClick={() => setIsOpen(true)}
      >
        View All
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
