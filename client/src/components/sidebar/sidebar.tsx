import React, { useEffect, useState } from "react";

import { Filter } from "../filter/filter";
import { ResponseState, APIResponse, Stats, APIError } from "../../types";
import "./sidebar.scss";
import * as api from "../../api/api";

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
      const res = await api.getYears();
      if ("errorCode" in res)
        setYears({ isLoaded: true, err: res, results: [] });
      else setYears({ isLoaded: true, err: null, results: res.results });
    }

    async function getGenres() {
      const res = await api.getGenres();
      if ("errorCode" in res)
        setGenres({ isLoaded: true, err: res, results: [] });
      else setGenres({ isLoaded: true, err: null, results: res.results });
    }

    async function getArtists() {
      const res = await api.getArtists();
      if ("errorCode" in res)
        setArtists({ isLoaded: true, err: res, results: [] });
      else setArtists({ isLoaded: true, err: null, results: res.results });
    }

    async function getLabels() {
      const res = await api.getLabels();
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
