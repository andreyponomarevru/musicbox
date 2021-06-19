import React, { useEffect, useState } from "react";

import { Pagination } from "../pagination/pagination";
import { ContentGrid } from "../content-grid/content-grid";
import "./grid-layout.scss";
import { useFetch } from "../../state/useFetch";
import { Loader } from "../loader/loader";
import { Sidebar } from "../sidebar/sidebar";
import { Stats } from "../stats/stats";
import { SelectSort } from "../select-sort/select-sort";
import { SelectItemsPerPage } from "../select-items-per-page/select-items-per-page";
import { SelectViewBtn } from "../select-view-btn/select-view-btn";
import { useControls } from "../../state/useControls";

const { REACT_APP_API_ROOT } = process.env;

interface Props {
  handleBtnClick: () => void;

  playingTrackId?: number;
  togglePlay: (metadata: TrackExtendedMetadata) => void;
}

//

export function GridLayout(props: Props): JSX.Element {
  const [
    { currentPage, sort, limit, countPageItemsFrom },
    setCurrentPage,
    setSort,
    setLimit,
    setCountPageItemsFrom,
    resetControls,
  ] = useControls();

  const stats = useFetch<NotPaginatedAPIResponse<DatabaseStats>>(
    `${REACT_APP_API_ROOT}/stats`
  );
  const releases = useFetch<PaginatedAPIResponse<ReleaseMetadata[]>>(
    `${REACT_APP_API_ROOT}/releases?sort=${sort}&page=${currentPage}&limit=${limit}`
  );

  function onListBtnClick() {
    resetControls();
    props.handleBtnClick();
  }

  async function onFilterClick(filter: string) {
    console.log("retrieve filtered data and set it ti state");
    console.log(filter);
  }

  if (stats.error) return <div>Oops! Something went wrong...</div>;
  if (stats.isLoading || !stats.response) return <Loader />;

  if (releases.error) return <div>Oops! Something went wrong...</div>;
  if (releases.isLoading || !releases.response) return <Loader />;

  return (
    <div className="grid-layout">
      <Sidebar
        className="grid-layout__sidebar"
        handleClick={onFilterClick}
        tracksInLib={stats.response.results.tracks}
      />

      <div className="grid-layout__nav">
        <Pagination
          className="grid-layout__pagination"
          limit={limit}
          totalItems={stats.response.results.releases}
          handleNextPageBtnClick={() => setCurrentPage(currentPage + 1)}
          handlePrevPageBtnClick={() => setCurrentPage(currentPage - 1)}
          buttons={{
            prev: !!releases.response.previous_page,
            next: !!releases.response.next_page,
          }}
          countPageItemsFrom={countPageItemsFrom}
        />
        <Stats stats={stats} className="grid-layout__stats" />
        <nav className="grid-layout__controls">
          <SelectSort
            value={sort}
            onSelectSort={(selected: string) => setSort(selected)}
            layout="grid"
          />
          <SelectItemsPerPage
            value={limit}
            handleChange={(selected: number) => {
              setLimit(selected);
              setCurrentPage(1);
              setCountPageItemsFrom(1);
            }}
          />
          <div className="grid-layout__select-layout">
            <SelectViewBtn
              handleBtnClick={onListBtnClick}
              active={false}
              iconName="list"
            />
            <SelectViewBtn active={true} iconName="grid" />
          </div>
        </nav>
      </div>

      <ContentGrid
        playingTrackId={props.playingTrackId}
        togglePlay={props.togglePlay}
        className="grid-layout__content"
        releases={releases.response.results}
      />
    </div>
  );
}
