import React from "react";

import { Filter } from "../filter/filter";
import "./sidebar.scss";
import { useFetch } from "../../state/useFetch";
import { Loader } from "../loader/loader";

const { REACT_APP_API_ROOT } = process.env;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  tracksInLib: number;
  releaseDeleted?: boolean;
  className?: string;
  handleClick: (filterName: string, filterById: string) => void;
}

export function Sidebar(props: Props): JSX.Element {
  const { className = "", tracksInLib, handleClick } = props;

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

  if (!years || !genres || !artists || !labels) return <Loader />;

  return (
    <aside className={`sidebar ${className}`}>
      <Filter
        handleClick={handleClick}
        name="Years"
        totalTracks={tracksInLib}
        stats={years}
      />
      <Filter
        handleClick={handleClick}
        name="Genres"
        totalTracks={tracksInLib}
        stats={genres}
      />
      <Filter
        handleClick={handleClick}
        name="Labels"
        totalTracks={tracksInLib}
        stats={labels}
      />
      <Filter
        handleClick={handleClick}
        name="Artists"
        totalTracks={tracksInLib}
        stats={artists}
      />
    </aside>
  );
}
