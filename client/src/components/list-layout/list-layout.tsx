import React, { useState, useEffect } from "react";

import { Pagination } from "../pagination/pagination";
import { ContentList } from "../content-list/content-list";
import "./list-layout.scss";
import { Sidebar } from "../sidebar/sidebar";
import { useFetch } from "../../state/useFetch";
import { Loader } from "../loader/loader";
import { SelectSort } from "../select-sort/select-sort";
import { SelectItemsPerPage } from "../select-items-per-page/select-items-per-page";
import { SelectViewBtn } from "../select-view-btn/select-view-btn";
import { Stats } from "../stats/stats";
import { useControls } from "../../state/useControls";

const { REACT_APP_API_ROOT } = process.env;

interface Props {
  handleBtnClick: () => void;

  playingTrackId?: number;
  togglePlay: (metadata: TrackExtendedMetadata) => void;
}

//

export function ListLayout(props: Props): JSX.Element {
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
  const tracks = useFetch<PaginatedAPIResponse<TrackExtendedMetadata[]>>(
    `${REACT_APP_API_ROOT}/tracks?sort=${sort}&page=${currentPage}&limit=${limit}`
  );

  // filters
  const [filterIds, setFilterIds] = useState<string[]>([]);

  function buildQuery(filterName: string, filterId: string) {
    return `${filterName}=${filterId}`;
    /*const test = [25, 58, 5, 9];
    console.log(
      test
        .map((id, index) => {
          if (index === 0) return `year=${id}`;
          else return `&year=${id}`;
        })
        .join("")
    );*/
  }

  const [filterUrl, setFilterUrl] = useState("");

  useEffect(() => {
    setFilterUrl(`${REACT_APP_API_ROOT}/tracks?${filterIds.join("&")}`);
  }, [filterIds]);

  function onGridBtnClick() {
    resetControls();
    props.handleBtnClick();
  }

  async function onFilterClick(filterName: string, id: string) {
    console.log(filterIds, id);
    if (filterIds.includes(id)) {
      console.log("MATCHED");
      return;
    }
    setFilterIds([...filterIds, buildQuery(filterName, id)]);
    //setFilterUrl()
  }

  if (stats.error) return <div>Oops! Something went wrong...</div>;
  if (stats.isLoading || !stats.response) return <Loader />;

  if (tracks.error) return <div>Oops! Something went wrong...</div>;
  if (tracks.isLoading || !tracks.response) return <Loader />;

  console.log(filterUrl);

  return (
    <div className="list-layout">
      <Sidebar
        className="list-layout__sidebar"
        handleClick={onFilterClick}
        tracksInLib={stats.response.results.tracks}
      />

      <div className="list-layout__nav">
        <Pagination
          className="list-layout__pagination"
          limit={limit}
          totalItems={stats.response.results.tracks}
          handleNextPageBtnClick={() => setCurrentPage(currentPage + 1)}
          handlePrevPageBtnClick={() => setCurrentPage(currentPage - 1)}
          buttons={{
            prev: !!tracks.response.previous_page,
            next: !!tracks.response.next_page,
          }}
          countPageItemsFrom={countPageItemsFrom}
        />
        <Stats stats={stats} className="grid-layout__stats" />
        <nav className="list-layout__controls">
          <SelectSort
            value={sort}
            onSelectSort={(selected: string) => setSort(selected)}
            layout="list"
          />
          <SelectItemsPerPage
            value={limit}
            handleChange={(selected: number) => {
              setLimit(selected);
              setCurrentPage(1);
              setCountPageItemsFrom(1);
            }}
          />
          <div className="list-layout__select-layout">
            <SelectViewBtn active={true} iconName="list" />
            <SelectViewBtn
              handleBtnClick={onGridBtnClick}
              active={false}
              iconName="grid"
            />
          </div>
        </nav>
      </div>

      <ContentList
        tracks={tracks.response.results}
        togglePlay={props.togglePlay}
        playingTrackId={props.playingTrackId}
      />
    </div>
  );
}
