import React from "react";

import { Pagination } from "../pagination/pagination";
import { Stats } from "../stats/stats";
import { SelectSort } from "../select-sort/select-sort";
import { SelectItemsPerPage } from "../select-items-per-page/select-items-per-page";
import { SelectViewBtn } from "../select-view-btn/select-view-btn";
import "./nav-bar.scss";
import { State as UseControlsState } from "../../state/useControls";
import { State as LayoutState } from "../../state/useLayout";
import { DatabaseStats } from "../../types";

type Props = {
  className?: string;

  controls: UseControlsState;
  setCurrentPage: (currentPage: number) => void;
  selectSort: (selected: string) => void;
  selectItemsPerPage: (itemsPerPage: { limit: number }) => void;
  handleViewBtnClick?: () => void;
  stats?: DatabaseStats;

  layout: LayoutState;
};

export function NavBar(props: Props): JSX.Element {
  const { className = "" } = props;
  const { controls, setCurrentPage, selectSort, selectItemsPerPage } = props;

  return (
    <div className={`nav-bar ${className}`}>
      <Pagination
        className="nav-bar__pagination"
        limit={props.controls.limit}
        totalItems={props.controls.totalCount}
        handleNextPageBtnClick={() =>
          setCurrentPage(props.controls.currentPage + 1)
        }
        handlePrevPageBtnClick={() =>
          setCurrentPage(props.controls.currentPage - 1)
        }
        buttons={{
          prev: !!props.controls.previousPage,
          next: !!props.controls.nextPage,
        }}
        countPageItemsFrom={controls.countPageItemsFrom}
      />
      <Stats stats={props.stats} className="nav-bar__stats" />
      <nav className="controls nav-bar__controls">
        <SelectSort
          value={props.controls.sort}
          handleSelectSort={selectSort}
          layout={props.layout}
          disabled={props.layout.disableControls}
        />
        <SelectItemsPerPage
          value={props.controls.limit}
          handleChange={(selected: number) => {
            selectItemsPerPage({ limit: selected });
          }}
          disabled={props.layout.disableControls}
        />
        <div className="controls__select-layout nav-bar__select-layout">
          <SelectViewBtn
            layout={props.layout}
            handleBtnClick={props.handleViewBtnClick}
          />
        </div>
      </nav>
    </div>
  );
}
