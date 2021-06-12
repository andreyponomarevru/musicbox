import React, { Component, Fragment } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onSelectSortChange: (controlName: string, value: string) => void;

  isGridLayoutActive: boolean;
  isListLayoutActive: boolean;
}

export function SelectSort(props: Props) {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    props.onSelectSortChange(e.target.name, e.target.value);
  }

  const { className = "select-sort" } = props;

  return (
    <div className={className}>
      Sort{" "}
      <select
        name="sort"
        className="select-sort__box"
        onChange={handleChange}
        value={props.value}
      >
        {props.isGridLayoutActive ? (
          <Fragment>
            <option value="artist,asc">Artist, A-Z</option>
            <option value="artist,desc">Artist, Z-A</option>
            <option value="title,asc">Release Title, A-Z</option>
            <option value="title,desc">Release Title, Z-A</option>
            <option value="year,asc">Year, 0-9</option>
            <option value="year,desc">Year, 9-0</option>
          </Fragment>
        ) : (
          <Fragment>
            <option value="track-artist,asc">Artist, A-Z</option>
            <option value="track-artist,desc">Artist, Z-A</option>
            <option value="track-title,asc">Title, A-Z</option>
            <option value="track-title,desc">Title, Z-A</option>
            <option value="year,asc">Year, 0-9</option>
            <option value="year,desc">Year, 9-0</option>
          </Fragment>
        )}
      </select>
    </div>
  );
}
