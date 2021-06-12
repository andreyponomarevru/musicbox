import React, { useEffect, useState } from "react";

import { Filter } from "../filter/filter";
import { ResponseState, APIResponse, Stats, APIError } from "../../types";
import "./sidebar.scss";
import { Loader } from "../loader/loader";
import { Error } from "../error/error";

const { REACT_APP_API_ROOT } = process.env;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  tracksInLib: number;
  releaseDeleted?: boolean;
  className?: string;
  handleClick: (filter: string) => void;
}

export function Sidebar(props: Props) {
  const { className = "", tracksInLib, handleClick } = props;

  const [years, setYears] = useState<ResponseState<Stats[]>>({
    isLoaded: false,
    err: null,
    results: [],
  });
  const [genres, setGenres] = useState<ResponseState<Stats[]>>({
    isLoaded: false,
    err: null,
    results: [],
  });
  const [artists, setArtists] = useState<ResponseState<Stats[]>>({
    isLoaded: false,
    err: null,
    results: [],
  });
  const [labels, setLabels] = useState<ResponseState<Stats[]>>({
    isLoaded: false,
    err: null,
    results: [],
  });

  async function getStats() {
    async function getYears() {
      const apiUrl = `${REACT_APP_API_ROOT}/stats/years`;
      const res: APIResponse<Stats[]> = await (await fetch(apiUrl)).json();
      if ("errorCode" in res)
        setYears({ isLoaded: true, err: res, results: [] });
      else setYears({ isLoaded: true, err: null, results: res.results });
    }

    async function getGenres() {
      const apiUrl = `${REACT_APP_API_ROOT}/stats/genres`;
      const res: APIResponse<Stats[]> = await (await fetch(apiUrl)).json();
      if ("errorCode" in res)
        setGenres({ isLoaded: true, err: res, results: [] });
      else setGenres({ isLoaded: true, err: null, results: res.results });
    }

    async function getArtists() {
      const apiUrl = `${REACT_APP_API_ROOT}/stats/artists`;
      const res: APIResponse<Stats[]> = await (await fetch(apiUrl)).json();
      if ("errorCode" in res)
        setArtists({ isLoaded: true, err: res, results: [] });
      else setArtists({ isLoaded: true, err: null, results: res.results });
    }

    async function getLabels() {
      const apiUrl = `${REACT_APP_API_ROOT}/stats/labels`;
      const res: APIResponse<Stats[]> = await (await fetch(apiUrl)).json();
      if ("errorCode" in res)
        setLabels({ isLoaded: true, err: res, results: [] });
      else setLabels({ isLoaded: true, err: null, results: res.results });
    }

    await getYears();
    await getGenres();
    await getArtists();
    await getLabels();
  }

  useEffect(() => {
    getStats();
  }, [props.releaseDeleted]);

  return (
    <aside className={`sidebar ${className}`}>
      <Filter
        handleClick={handleClick}
        name="Years"
        totalTracks={tracksInLib}
        response={years}
      />
      <Filter
        handleClick={handleClick}
        name="Genres"
        totalTracks={tracksInLib}
        response={genres}
      />
      <Filter
        handleClick={handleClick}
        name="Labels"
        totalTracks={tracksInLib}
        response={labels}
      />
      <Filter
        handleClick={handleClick}
        name="Artists"
        totalTracks={tracksInLib}
        response={artists}
      />
    </aside>
  );
}
