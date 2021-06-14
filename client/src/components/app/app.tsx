import React, { useState, useEffect, ReactElement } from "react";
import { Route } from "react-router-dom";

import { AppHeader } from "./../app-header/app-header";
import { AddRelease } from "../page_add-release/add-release";
import { Main } from "../page_main/main";
import { Player } from "../player/player";
import { Sidebar } from "../sidebar/sidebar";
import { Stats } from "../stats/stats";
import { Pagination } from "../pagination/pagination";
import { SelectSort } from "../select-sort/select-sort";
import { SelectItemsPerPage } from "../select-items-per-page/select-items-per-page";
import { SelectViewBtn } from "../select-view-btn/select-view-btn";
import "./app.scss";
import {
  DatabaseStats,
  ResponseState,
  TrackExtendedMetadata,
  ReleaseMetadata,
  PaginatedAPIResponse,
} from "../../types";
import { Loader } from "../loader/loader";
import "./app.scss";
import * as api from "../../api/api";

const { REACT_APP_API_ROOT } = process.env;

// TODO: try to move pagination component deeper, into content-list/grid comp

export function App(): ReactElement {
  // Stats
  const [stats, setStats] = useState<ResponseState<DatabaseStats>>({
    isLoaded: false,
    err: null,
    results: { releases: 0, tracks: 0, artists: 0, labels: 0, genres: 0 },
  });

  // Filters
  //const [filters, setFilters] = useState<null | string[]>(null);

  // Misc
  //const [releaseDeleted, setReleaseDeleted] = useState(false);

  // Player
  // TODO: group in one object
  // Add event lsitener to "end" event to start playing a new https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<null | HTMLAudioElement>(null);
  const [playingTrack, setPlayingTrack] =
    useState<undefined | TrackExtendedMetadata>(undefined);

  // Content
  const [tracks, setTracks] = useState<
    ResponseState<TrackExtendedMetadata[] | []>
  >({ isLoaded: false, err: null, results: [] });
  const [releases, setReleases] = useState<ResponseState<ReleaseMetadata[]>>({
    isLoaded: false,
    err: null,
    results: [],
  });

  const [layout, setLayout] = useState<"grid" | "list">("grid");

  const [page, setPage] = useState(1);
  const [pagingBtns, setPagingBtns] = useState({ prev: false, next: false });
  const [countPageItemsFrom, setCountPageItemsFrom] = useState(1);

  const [sort, setSort] = useState("year,desc");
  const [limit, setLimit] = useState(25);

  const [searchQuery, setSearchQuery] = useState("");

  //

  function togglePlay(selectedTrack: TrackExtendedMetadata) {
    const audioURL = `${REACT_APP_API_ROOT}/tracks/${selectedTrack.trackId}/stream`;

    // If we're starting player for the first time
    if (!playingTrack) {
      setPlayingTrack(selectedTrack);
      setAudio(new Audio(audioURL));
      setIsPlaying(true);
      // If we've clicked on an already playing tracks
    } else if (playingTrack.trackId === selectedTrack.trackId && isPlaying) {
      setIsPlaying(false);
      // If we've clicked on a paused tracks
    } else if (playingTrack.trackId === selectedTrack.trackId && !isPlaying) {
      setIsPlaying(true);
      // If we've clicked on a new track
    } else if (playingTrack.trackId !== selectedTrack.trackId) {
      if (audio) audio.pause();
      setPlayingTrack(selectedTrack);
      setAudio(new Audio(audioURL));
      setIsPlaying(true);
    }
  }

  function onNextPageBtnClick() {
    const nextPage = page + 1;
    setPage(nextPage);
    const countFrom = limit * page + 1;
    setCountPageItemsFrom(countFrom);
  }

  function onPrevPageBtnClick() {
    const prevPage = page - 1;
    setPage(prevPage);
    const countFrom = countPageItemsFrom - limit;
    setCountPageItemsFrom(countFrom);
  }

  function onSelectItemsPerPage(value: number) {
    setLimit(value);
    setPage(1);

    const numOfItems =
      layout === "grid" ? stats.results.releases : stats.results.tracks;
    setCountPageItemsFrom(1);
    setPagingBtns({ prev: page > 1, next: numOfItems / value > 1 });
  }

  function onListBtnClick() {
    // NOTE: we reset "sort" key to default value 'year,desc' to prevent API
    // request with invalid query params from select box
    setLayout("list");
    setSort("year,desc");
    setLimit(25);
    setPage(1);
    setCountPageItemsFrom(1);
  }

  function onGridBtnClick() {
    // NOTE: we reset "sort" key to default value 'year,desc' to prevent API request with invalid query params from select box
    setLayout("grid");
    setSort("year,desc");
    setLimit(25);
    setPage(1);
    setCountPageItemsFrom(1);
  }

  /*
  async function onDeleteReleaseBtnClick(releaseId: number) {
    const apiUrl = `${REACT_APP_API_ROOT}/releases/${releaseId}`;
    const res = await fetch(apiUrl, { method: "DELETE" });
    if (res.ok) {
      //await getStats();
      //setReleaseDeleted(true);
    } else {
      //setReleaseDeleted(false);
    }
	}
	*/

  async function onFilterClick(filter: string) {
    console.log("retrieve filtered data and set it ti state");
    console.log(filter);
  }

  async function getSearchedTracks(input: string) {
    const res: PaginatedAPIResponse<TrackExtendedMetadata[]> =
      input === ""
        ? await api.getTracks(sort, limit, page)
        : await api.getSearchedTracks(input);

    if ("errorCode" in res) {
      setTracks({ isLoaded: true, err: res, results: [] });
    } else {
      setTracks({ isLoaded: true, err: null, results: res.results });
      setPagingBtns({ prev: !!res.previous_page, next: !!res.next_page });

      // TODO: you need to remove one fo these function cause it triggers another state update which returns me to previous state with all tracks dispalyed isntead of only those matching the search query
      setLayout("list");
      setSort("year,desc");
      setLimit(25);
      setPage(1);
      setCountPageItemsFrom(1);
    }
  }

  //async function onSearchInput() {}

  //

  // Player
  useEffect(() => {
    if (audio && isPlaying) audio.play();
    else if (audio && !isPlaying) audio.pause();
  }, [isPlaying, audio]);

  useEffect(() => {
    async function getStats() {
      const res = await api.getStats();

      if ("errorCode" in res)
        setStats({
          isLoaded: true,
          err: res,
          results: { releases: 0, tracks: 0, artists: 0, labels: 0, genres: 0 },
        });
      else setStats({ isLoaded: true, err: null, results: res.results });
    }

    getStats();
  }, [stats]);

  // Pagination
  useEffect(() => {
    //let isSearchActive = false;

    async function getReleases(sortControl = sort, limitControl = limit) {
      const res = await api.getReleases(sortControl, limitControl, page);

      if ("errorCode" in res) {
        setReleases({ isLoaded: true, err: res, results: [] });
      } else {
        setReleases({ isLoaded: true, err: null, results: res.results });
        setPagingBtns({ prev: !!res.previous_page, next: !!res.next_page });
      }
    }

    async function getTracks(sortControl = sort, limitControl = limit) {
      const res = await api.getTracks(sortControl, limitControl, page);

      if ("errorCode" in res) {
        setTracks({ isLoaded: true, err: res, results: [] });
      } else {
        setTracks({ isLoaded: true, err: null, results: res.results });
        setPagingBtns({ prev: !!res.previous_page, next: !!res.next_page });
      }
    }

    if (layout === "grid") {
      getReleases(sort, limit);
    } else {
      getTracks(sort, limit);
    }
  }, [page, sort, limit, layout]);

  if (stats.err) throw new Error(stats.err.message);
  if (!stats.isLoaded) return <Loader />;

  //

  const mainProps = {
    layout,
    releases,
    tracks,
    togglePlay,
    playingTrackId: playingTrack ? playingTrack.trackId : undefined,
  };

  return (
    <div className="app">
      <AppHeader handleSearchInput={getSearchedTracks} />
      <Sidebar handleClick={onFilterClick} tracksInLib={stats.results.tracks} />

      <div className="app__bar">
        <Pagination
          className="app__pagination"
          limit={limit}
          totalTracks={stats.results.tracks}
          totalReleases={stats.results.releases}
          layout={layout}
          handleNextPageBtnClick={onNextPageBtnClick}
          handlePrevPageBtnClick={onPrevPageBtnClick}
          buttons={{ prev: pagingBtns.prev, next: pagingBtns.next }}
          countPageItemsFrom={countPageItemsFrom}
        />

        <Stats response={stats} className="app__stats" />

        <nav className="app__controls">
          <SelectSort value={sort} onSelectSort={setSort} layout={layout} />
          <SelectItemsPerPage
            value={limit}
            handleChange={onSelectItemsPerPage}
          />
          <div className="app__select-layout">
            <SelectViewBtn
              handleBtnClick={onListBtnClick}
              active={layout === "list"}
              iconName="list"
            />
            <SelectViewBtn
              handleBtnClick={onGridBtnClick}
              active={layout === "grid"}
              iconName="grid"
            />
          </div>
        </nav>
      </div>

      <Route exact path="/" render={() => <Main {...mainProps} />} />

      <Player
        handleTogglePlay={togglePlay}
        playingTrack={playingTrack}
        active={!!isPlaying}
      />

      {/* Routing*/}
      <Route path="/release/add" component={AddRelease} />
    </div>
  );
}
