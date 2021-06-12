import React, { useState, useEffect } from "react";
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
import { GroupingBtn } from "../grouping-btn/grouping-btn";
import "./app.scss";
import {
  APIResponse,
  DatabaseStats,
  ResponseState,
  TrackExtendedMetadata,
  ReleaseMetadata,
  PaginatedAPIResponse,
} from "../../types";
import { Loader } from "../loader/loader";
import "./app.scss";

const { REACT_APP_API_ROOT } = process.env;

function App() {
  // Stats
  const [stats, setStats] = useState<ResponseState<DatabaseStats>>({
    isLoaded: false,
    err: null,
    results: { releases: 0, tracks: 0, artists: 0, labels: 0, genres: 0 },
  });

  // Filters
  const [filters, setFilters] = useState<null | string[]>(null);

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

  // Layout
  const [isListLayoutActive, setListLayoutActive] = useState(false);
  const [isGridLayoutActive, setGridLayoutActive] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [isNextBtnActive, setIsNextBtnActive] = useState(false);
  const [isPrevBtnActive, setIsPrevBtnActive] = useState(false);
  const [itemsCountFrom, setItemsCountFrom] = useState(1);

  // Sort
  const [sort, setSort] = useState("year,desc");
  const [limit, setLimit] = useState(25);

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
      audio!.pause();
      setPlayingTrack(selectedTrack);
      setAudio(new Audio(audioURL));
      setIsPlaying(true);
    }
  }

  async function onNextPageBtnClick() {
    const nextPage = page + 1;
    setPage(nextPage);
    setItemsCountFrom(limit * page + 1);

    if (isGridLayoutActive) await getReleases();
    else if (isListLayoutActive) await getTracks();
  }

  async function onPrevPageBtnClick() {
    const prevPage = page - 1;
    setPage(prevPage);
    setItemsCountFrom(itemsCountFrom - limit);

    if (isGridLayoutActive) await getReleases();
    else if (isListLayoutActive) await getTracks();
  }

  async function onSelectSortChange(controlName: string, value: string) {
    if (controlName === "sort") setSort(value);

    if (isGridLayoutActive) await getReleases(sort, limit);
    else await getTracks(sort, limit);
  }

  async function onSelectItemsPerPageChange(
    controlName: string,
    value: number
  ) {
    if (controlName === "limit") {
      setLimit(value);
      setPage(1);
    }

    const numOfItems = isGridLayoutActive
      ? stats.results.releases
      : stats.results.tracks;

    setIsNextBtnActive(numOfItems / value > 1);
    setIsPrevBtnActive(page > 1);

    if (isGridLayoutActive) await getReleases(sort, limit);
    else await getTracks(sort, limit);
  }

  async function onListBtnClick() {
    // NOTE: we reset "sort" key to default value 'year,desc' to prevent API
    // request with invalid query params from select box

    setListLayoutActive(true);
    setGridLayoutActive(false);
    setSort("year,desc");
    setLimit(25);
    setPage(1);
    setItemsCountFrom(1);

    await getTracks("year,desc", 25);
  }

  async function onGridBtnClick() {
    // NOTE: we reset "sort" key to default value 'year,desc' to prevent API request with invalid query params from select box

    setListLayoutActive(false);
    setGridLayoutActive(true);
    setSort("year,desc");
    setLimit(25);
    setPage(1);
    setItemsCountFrom(1);

    await getReleases("year,desc", 25);
  }

  async function getStats() {
    const apiUrl = `${REACT_APP_API_ROOT}/stats`;
    const res: APIResponse<DatabaseStats> = await (await fetch(apiUrl)).json();
    if ("errorCode" in res)
      setStats({
        isLoaded: true,
        err: res,
        results: { releases: 0, tracks: 0, artists: 0, labels: 0, genres: 0 },
      });
    else setStats({ isLoaded: true, err: null, results: res.results });
  }

  async function getTracks(
    sortControl: string = sort,
    limitControl: number = limit
  ) {
    console.log(sortControl, limitControl);

    const apiUrl = `${REACT_APP_API_ROOT}/tracks?sort=${sortControl}&page=${page}&limit=${limitControl}`;

    console.log(apiUrl);

    const res: PaginatedAPIResponse<TrackExtendedMetadata[]> = await (
      await fetch(apiUrl)
    ).json();
    if ("errorCode" in res) {
      setTracks({ isLoaded: true, err: res, results: [] });
    } else {
      setTracks({ isLoaded: true, err: null, results: res.results });
      setIsNextBtnActive(!!res.next_page);
      setIsPrevBtnActive(!!res.previous_page);
    }
  }

  // TODO: refasctor, this func should do only one thing, move pagination outside
  async function getReleases(
    sortControl: string = sort,
    limitControl: number = limit
  ) {
    const apiUrl = `${REACT_APP_API_ROOT}/releases?sort=${sortControl}&page=${page}&limit=${limitControl}`;

    console.log(apiUrl);

    const res: PaginatedAPIResponse<ReleaseMetadata[]> = await (
      await fetch(apiUrl)
    ).json();

    if ("errorCode" in res) {
      setReleases({ isLoaded: true, err: res, results: [] });
    } else {
      setReleases({ isLoaded: true, err: null, results: res.results });
      setIsNextBtnActive(!!res.next_page);
      setIsPrevBtnActive(!!res.previous_page);
    }
  }

  async function onDeleteReleaseBtnClick(releaseId: number) {
    const apiUrl = `${REACT_APP_API_ROOT}/releases/${releaseId}`;
    const res = await fetch(apiUrl, { method: "DELETE" });
    if (res.ok) {
      await getStats();
      //setReleaseDeleted(true);
    } else {
      //setReleaseDeleted(false);
    }
  }

  async function onFilterClick(filter: string) {
    console.log("retrieve filtered data and set it ti state");
    console.log(filter);
  }

  // Player
  useEffect(() => {
    if (audio && isPlaying) audio.play();
    else if (audio && !isPlaying) audio.pause();
  }, [isPlaying, audio]);

  useEffect(() => {
    getStats();
  }, []);

  // Pagination
  useEffect(() => {
    if (isGridLayoutActive) getReleases(sort, limit);
    else getTracks(sort, limit);
  }, [page, sort, limit]);

  if (stats.err) throw new Error(stats.err.message);
  if (!stats.isLoaded) return <Loader />;

  const mainProps = {
    isGridLayoutActive: isGridLayoutActive,
    isListLayoutActive: isListLayoutActive,
    releases,
    tracks,
    togglePlay,
    playingTrackId: playingTrack ? playingTrack.trackId : undefined,
  };

  return (
    <div className="app">
      <AppHeader />
      <Sidebar handleClick={onFilterClick} tracksInLib={stats.results.tracks} />

      <div className="app__bar">
        <Pagination
          className="app__pagination"
          limit={limit}
          totalTracks={stats.results.tracks}
          totalReleases={stats.results.releases}
          isGridLayoutActive={isGridLayoutActive}
          isListLayoutActive={isListLayoutActive}
          onNextPageBtnClick={onNextPageBtnClick}
          onPrevPageBtnClick={onPrevPageBtnClick}
          isNextBtnActive={isNextBtnActive}
          isPrevBtnActive={isPrevBtnActive}
          itemsCountFrom={itemsCountFrom}
        />

        <Stats response={stats} className="app__stats" />

        <nav className="app__controls">
          <SelectSort
            value={sort}
            onSelectSortChange={onSelectSortChange}
            isGridLayoutActive={isGridLayoutActive}
            isListLayoutActive={isListLayoutActive}
          />
          <SelectItemsPerPage
            value={limit}
            onSelectItemsPerPageChange={onSelectItemsPerPageChange}
          />
          <div className="app__select-layout">
            <GroupingBtn
              onBtnClick={onListBtnClick}
              active={isListLayoutActive}
              iconName="list"
            />
            <GroupingBtn
              onBtnClick={onGridBtnClick}
              active={isGridLayoutActive}
              iconName="grid"
            />
          </div>
        </nav>
      </div>

      <Route exact path="/" render={() => <Main {...mainProps} />} />

      <Player
        togglePlay={togglePlay}
        playingTrack={playingTrack}
        active={!!isPlaying}
      />

      {/* Routing*/}
      <Route path="/release/add" component={AddRelease} />
    </div>
  );
}

export { App };
