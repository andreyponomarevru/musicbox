import React, { useState } from "react";

import "./search-layout.scss";
import { Pagination } from "../pagination/pagination";
import { ContentList } from "../content-list/content-list";
import { useFetch } from "../../state/useFetch";
import { Loader } from "../loader/loader";

interface Props {
  //handleSearch: (query: string) => void;

  searchQuery: string;

  playingTrackId?: number;
  togglePlay: (selectedTrack: TrackExtendedMetadata) => void;
}

const { REACT_APP_API_ROOT } = process.env;

export function SearchLayout(props: Props): JSX.Element | null {
  const limit = 25;

  const [page, setPage] = useState(1);
  const [countPageItemsFrom, setCountPageItemsFrom] = useState(1);

  const stats = useFetch<NotPaginatedAPIResponse<DatabaseStats>>(
    `${REACT_APP_API_ROOT}/stats`
  );

  const url = `${REACT_APP_API_ROOT}/search?q=${props.searchQuery}&page=1&limit=25`;
  const searchResults =
    useFetch<PaginatedAPIResponse<TrackExtendedMetadata[]>>(url);

  if (!searchResults.response) return null;
  //

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

  if (!stats.response || !searchResults.response) return <Loader />;

  return (
    <div className="search-layout">
      <div className="search-layout__nav">
        <Pagination
          className="app__pagination"
          limit={limit}
          totalItems={searchResults.response.results.length}
          handleNextPageBtnClick={onNextPageBtnClick}
          handlePrevPageBtnClick={onPrevPageBtnClick}
          buttons={{
            prev: !!searchResults.response.previous_page,
            next: !!searchResults.response.next_page,
          }}
          countPageItemsFrom={countPageItemsFrom}
        />
        <nav className="search-layout__controls"></nav>
      </div>

      <ContentList
        tracks={searchResults.response.results}
        togglePlay={props.togglePlay}
        playingTrackId={props.playingTrackId}
      />
    </div>
  );
}
