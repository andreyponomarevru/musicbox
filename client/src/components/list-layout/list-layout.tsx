import React, { useEffect } from "react";

import { ContentList } from "../content-list/content-list";
import "./list-layout.scss";
import { Loader } from "../loader/loader";
import { useControls } from "../../state/useControls";
import { State as FiltersState } from "../../state/useFilters";
import { NavBar } from "../nav-bar/nav-bar";
import {
  TrackExtendedMetadata,
  DatabaseStats,
  PaginationParams,
} from "../../types";
import { State as LayoutState } from "../../state/useLayout";

interface Props {
  handleViewBtnClick: () => void;
  playingTrackId?: number;
  togglePlay: (metadata: TrackExtendedMetadata) => void;
  url: string;
  stats?: DatabaseStats;
  className?: string;
  filters: FiltersState;
  layout: LayoutState;
}

export function ListLayout(props: Props): JSX.Element {
  const {
    url,
    controls,
    resetControls,
    selectItemsPerPage,
    selectSort,
    setCurrentPage,
    setPreviousPage,
    setNextPage,
    setTotalCount,
  } = useControls(props.url);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) resetControls();

    return () => {
      isMounted = false;
    };
  }, [props.filters]);

  function handleLoadedData(paginationParams: PaginationParams) {
    const { totalCount, previousPage, nextPage } = paginationParams;

    setPreviousPage(previousPage);
    setNextPage(nextPage);
    setTotalCount(totalCount);
  }

  //

  if (!props.stats) return <Loader />;

  return (
    <div className={`list-layout ${props.className}`}>
      <div className="list-layout__header">
        <NavBar
          className="list-layout__nav-bar"
          controls={controls}
          stats={props.stats}
          handleViewBtnClick={props.handleViewBtnClick}
          selectItemsPerPage={selectItemsPerPage}
          setCurrentPage={setCurrentPage}
          selectSort={selectSort}
          layout={props.layout}
        />
      </div>
      <ContentList
        className="list-layout__content-list"
        url={url}
        togglePlay={props.togglePlay}
        playingTrackId={props.playingTrackId}
        handleLoadedData={handleLoadedData}
      />
    </div>
  );
}
