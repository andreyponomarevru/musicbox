import React, { Component, Fragment } from "react";

import { Arrow } from "../arrow/arrow";
import "./pagination.scss";

interface Props extends React.HTMLAttributes<HTMLUListElement> {
  limit: number; // items per page
  totalTracks: number;
  totalReleases: number;

  isGridLayoutActive: boolean;
  isListLayoutActive: boolean;

  onNextPageBtnClick: any;
  onPrevPageBtnClick: any;

  isNextBtnActive: boolean;
  isPrevBtnActive: boolean;

  itemsCountFrom: number;
}

export function Pagination(props: Props) {
  // FIX: Maybe there is no sense in passing all these props down to this components and it's better to calculat pagination range in upper component (Content) and make This componetn 100% dumb?

  const {
    limit,
    totalTracks,
    totalReleases,
    className = "",
    isGridLayoutActive,
    isListLayoutActive,
    itemsCountFrom,
  } = props;

  let to;

  if (isListLayoutActive) {
    to =
      itemsCountFrom +
      (totalTracks - itemsCountFrom >= limit
        ? limit - 1
        : totalTracks - itemsCountFrom);
  } else if (isGridLayoutActive) {
    to =
      itemsCountFrom +
      (totalReleases - itemsCountFrom >= limit
        ? limit - 1
        : totalReleases - itemsCountFrom);
  }

  const prevBtnActive = (
    <a href="#" className="link" onClick={props.onPrevPageBtnClick}>
      <Arrow direction="left" /> Prev
    </a>
  );
  const prevBtnInactive = (
    <Fragment>
      <Arrow direction="left" /> Prev
    </Fragment>
  );

  const nextBtnActive = (
    <a href="#" className="link" onClick={props.onNextPageBtnClick}>
      Next <Arrow direction="right" />
    </a>
  );
  const nextBtnInactive = (
    <Fragment>
      Next <Arrow direction="right" />
    </Fragment>
  );

  return (
    <ul className={`pagination ${className}`}>
      <li className="pagination__current-page">
        {itemsCountFrom} - {to} of{" "}
        {isGridLayoutActive ? totalReleases : totalTracks}
      </li>
      <li className="pagination__prev">
        {props.isPrevBtnActive ? prevBtnActive : prevBtnInactive}
      </li>
      <li className="pagination__next">
        {props.isNextBtnActive ? nextBtnActive : nextBtnInactive}
      </li>
    </ul>
  );
}
