import React, { useEffect } from "react";

import "./search-layout.scss";
import { ContentList } from "../content-list/content-list";
import { useControls } from "../../state/useControls";
import { NavBar } from "../nav-bar/nav-bar";
import { TrackExtendedMetadata, DatabaseStats } from "../../types";
import { State as LayoutState } from "../../state/useLayout";

interface Props {
  playingTrackId?: number;
  togglePlay: (metadata: TrackExtendedMetadata) => void;
  url: string;
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

export function SearchLayout(props: Props): JSX.Element | null {
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

    if (isMounted) {
      resetControls();
      selectItemsPerPage({ limit: 25 });
    }

    return () => {
      isMounted = false;
    };
  }, [props.url]);

  function handleLoadedData(paginationParams: PaginationParams) {
    const { totalCount, previousPage, nextPage } = paginationParams;

    setPreviousPage(previousPage);
    setNextPage(nextPage);
    setTotalCount(totalCount);
  }

  return (
    <div className={`search-layout ${props.className}`}>
      <NavBar
        layout={props.layout}
        className="search-layout__nav-bar"
        controls={controls}
        stats={props.stats}
        selectItemsPerPage={selectItemsPerPage}
        setCurrentPage={setCurrentPage}
        selectSort={selectSort}
      />
      <ContentList
        className="search-layout__content-list"
        url={url}
        handleLoadedData={handleLoadedData}
        togglePlay={props.togglePlay}
        playingTrackId={props.playingTrackId}
      />
    </div>
  );
}
