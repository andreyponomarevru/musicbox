import React, { ReactElement } from "react";

import { AppHeader } from "./../app-header/app-header";
import "./app.scss";
import "./app.scss";
import { Player } from "../player/player";
import { usePlayer } from "../../state/usePlayer";
import { useFilters } from "../../state/useFilters";
import { Sidebar } from "../sidebar/sidebar";
import { useFetch } from "../../state/useFetch";
import { Loader } from "../loader/loader";
import { useSearch } from "../../state/useSearch";
import { GridLayout } from "../grid-layout/grid-layout";
import { ListLayout } from "../list-layout/list-layout";
import { SearchLayout } from "../search-layout/search-layout";
import { useLayout } from "../../state/useLayout";
import { NotPaginatedAPIResponse, DatabaseStats } from "../../types";

const { REACT_APP_API_ROOT } = process.env;
let timerId: NodeJS.Timeout;

export function App(): ReactElement {
  const [filters, filtersURL, toggleFilter, resetFilter] = useFilters();
  const [searchURL, setSearchQuery] = useSearch();
  const [layout, setLayout] = useLayout("list");
  const [{ playingTrackMeta, isPlaying }, togglePlay] = usePlayer();
  const stats = useFetch<NotPaginatedAPIResponse<DatabaseStats>>(
    `${REACT_APP_API_ROOT}/stats`
  );

  async function setFilter(filterName: string, filterId: number) {
    toggleFilter({ filter: filterName, id: filterId });
  }

  function handleSearchInput(input: string) {
    if (timerId) clearTimeout(timerId);

    if (input.length > 1) {
      timerId = setTimeout(() => {
        setSearchQuery(input);
        if (layout.name !== "search") setLayout("search");
      }, 700);
    } else {
      setLayout("list");
    }
  }

  if (stats.error) return <div>Oops! Something went wrong...</div>;
  if (stats.isLoading || !stats.response) return <Loader />;

  let currentLayoutJSX;
  switch (layout.name) {
    case "search":
      currentLayoutJSX = (
        <SearchLayout
          className="app__main"
          url={searchURL}
          playingTrackId={playingTrackMeta?.trackId}
          togglePlay={togglePlay}
          layout={layout}
        />
      );
      break;
    case "list":
      currentLayoutJSX = (
        <ListLayout
          className="app__main"
          url={filtersURL}
          playingTrackId={playingTrackMeta?.trackId}
          togglePlay={togglePlay}
          handleViewBtnClick={() => setLayout("grid")}
          stats={stats.response?.results}
          filters={filters}
          layout={layout}
        />
      );
      break;
    default:
      currentLayoutJSX = (
        <GridLayout
          className="app__main"
          stats={stats.response?.results}
          playingTrackId={playingTrackMeta?.trackId}
          togglePlay={togglePlay}
          handleViewBtnClick={() => setLayout("list")}
          layout={layout}
        />
      );
  }

  return (
    <div className="app">
      <AppHeader
        handleSearchInput={handleSearchInput}
        handleLogoClick={() => setLayout("list")}
      />

      <Sidebar
        className="app__sidebar"
        setFilter={setFilter}
        tracksInLib={stats.response.results.tracks}
        appliedFilters={filters}
        disabled={layout.disableSidebar}
        resetFilter={resetFilter}
      />

      {currentLayoutJSX}

      <Player
        setTrack={togglePlay}
        playingTrack={playingTrackMeta}
        isPlaying={isPlaying}
      />
    </div>
  );
}
