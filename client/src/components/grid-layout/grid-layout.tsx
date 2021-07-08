import React from "react";

import { ContentGrid } from "../content-grid/content-grid";
import "./grid-layout.scss";
import { Loader } from "../loader/loader";
import { useControls } from "../../state/useControls";
import { NavBar } from "../nav-bar/nav-bar";
import { TrackExtendedMetadata, DatabaseStats } from "../../types";
import { State as LayoutState } from "../../state/useLayout";

const { REACT_APP_API_ROOT } = process.env;

interface Props {
  handleViewBtnClick: () => void;
  playingTrackId?: number;
  togglePlay: (metadata: TrackExtendedMetadata) => void;
  stats?: DatabaseStats;
  className?: string;
  layout: LayoutState;
}

type PaginationParams = {
  totalCount: number;
  previousPage: string | null;
  nextPage: string | null;
};

//

export function GridLayout(props: Props): JSX.Element {
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
  } = useControls(`${REACT_APP_API_ROOT}/releases`);

  function handleLoadedData(paginationParams: PaginationParams) {
    const { totalCount, previousPage, nextPage } = paginationParams;

    setPreviousPage(previousPage);
    setNextPage(nextPage);
    setTotalCount(totalCount);
  }

  async function setFilter(filter: string) {
    // TODO: currently API doesn't support filtering for releases.
    // ... (retrieve filtered data and save it to state)
  }

  if (!props.stats) return <Loader />;

  return (
    <div className={`grid-layout ${props.className}`}>
      <NavBar
        className="grid-layout__nav-bar"
        controls={controls}
        stats={props.stats}
        handleViewBtnClick={props.handleViewBtnClick}
        selectItemsPerPage={selectItemsPerPage}
        setCurrentPage={setCurrentPage}
        selectSort={selectSort}
        layout={props.layout}
      />
      <ContentGrid
        className="grid-layout__content"
        url={url}
        togglePlay={props.togglePlay}
        playingTrackId={props.playingTrackId}
        handleLoadedData={handleLoadedData}
      />
    </div>
  );
}
