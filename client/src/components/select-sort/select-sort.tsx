import React, { Fragment } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onSelectSort: (selected: string) => void;
  layout: Layout;
}

export function SelectSort(props: Props) {
  const { className = "" } = props;

  return (
    <div className={`select-sort ${className}`}>
      Sort{" "}
      <select
        name="sort"
        className="select-sort__box"
        onChange={(e) => props.onSelectSort(e.target.value)}
        value={props.value}
      >
        {props.layout === "grid" ? (
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
