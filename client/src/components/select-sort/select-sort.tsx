import React, { Fragment } from "react";

import { State as LayoutState } from "../../state/useLayout";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  handleSelectSort: (selected: string) => void;
  layout: LayoutState;

  disabled?: boolean;
}

export function SelectSort(props: Props) {
  const { className = "", disabled = false } = props;

  return (
    <div className={`select-sort ${className}`}>
      Sort{" "}
      <select
        name="sort"
        className="select-sort__box"
        onChange={(e) => props.handleSelectSort(e.target.value)}
        value={props.value}
        disabled={disabled}
      >
        {props.layout.name === "grid" ? (
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
            <option value="track_artist,asc">Artist, A-Z</option>
            <option value="track_artist,desc">Artist, Z-A</option>
            <option value="track_title,asc">Title, A-Z</option>
            <option value="track_title,desc">Title, Z-A</option>
            <option value="year,asc">Year, 0-9</option>
            <option value="year,desc">Year, 9-0</option>
          </Fragment>
        )}
      </select>
    </div>
  );
}
