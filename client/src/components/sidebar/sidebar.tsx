import React from "react";

import { Filter } from "../filter/filter";
import "./sidebar.scss";
import { useFetch } from "../../state/useFetch";
import { Loader } from "../loader/loader";
import { NotPaginatedAPIResponse, Stats } from "../../types";

const { REACT_APP_API_ROOT } = process.env;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  tracksInLib: number;
  releaseDeleted?: boolean;
  className?: string;
  setFilter: (filterName: string, filterById: number) => void;
  appliedFilters?: { [key: string]: number[] };
  disabled: boolean;
  resetFilter: (filter: string) => void;
}

export function Sidebar(props: Props): JSX.Element {
  const { className = "" } = props;

  const { response: years } = useFetch<NotPaginatedAPIResponse<Stats[]>>(
    `${REACT_APP_API_ROOT}/stats/years`
  );
  const { response: genres } = useFetch<NotPaginatedAPIResponse<Stats[]>>(
    `${REACT_APP_API_ROOT}/stats/genres`
  );
  const { response: artists } = useFetch<NotPaginatedAPIResponse<Stats[]>>(
    `${REACT_APP_API_ROOT}/stats/artists`
  );
  const { response: labels } = useFetch<NotPaginatedAPIResponse<Stats[]>>(
    `${REACT_APP_API_ROOT}/stats/labels`
  );

  //

  if (!years || !genres || !artists || !labels) return <Loader />;

  return (
    <aside
      className={`sidebar ${className} ${
        props.disabled ? "sidebar_disabled" : ""
      }`}
    >
      <Filter
        className={props.disabled ? "filter_disabled" : ""}
        appliedFilters={props.appliedFilters?.years}
        setFilter={props.setFilter}
        name="years"
        totalTracks={props.tracksInLib}
        stats={years}
        resetFilter={props.resetFilter}
      />
      <Filter
        className={props.disabled ? "filter_disabled" : ""}
        appliedFilters={props.appliedFilters?.genres}
        setFilter={props.setFilter}
        name="genres"
        totalTracks={props.tracksInLib}
        stats={genres}
        resetFilter={props.resetFilter}
      />
      <Filter
        className={props.disabled ? "filter_disabled" : ""}
        appliedFilters={props.appliedFilters?.labels}
        setFilter={props.setFilter}
        name="labels"
        totalTracks={props.tracksInLib}
        stats={labels}
        resetFilter={props.resetFilter}
      />
      <Filter
        className={props.disabled ? "filter_disabled" : ""}
        appliedFilters={props.appliedFilters?.artists}
        setFilter={props.setFilter}
        name="artists"
        totalTracks={props.tracksInLib}
        stats={artists}
        resetFilter={props.resetFilter}
      />
    </aside>
  );
}
