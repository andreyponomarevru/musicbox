import React, { Component, Fragment } from "react";

import { Arrow } from "../arrow/arrow";
import "./pagination.scss";
import { Layout } from "../../types";

interface Props extends React.HTMLAttributes<HTMLUListElement> {
  limit: number; // items per page
  totalTracks: number;
  totalReleases: number;

  layout: Layout;

  handleNextPageBtnClick: any;
  handlePrevPageBtnClick: any;

  buttons: { prev: boolean; next: boolean };

  countPageItemsFrom: number;
}

export function Pagination(props: Props) {
  // FIX: Maybe there is no sense in passing all these props down to this components and it's better to calculat pagination range in upper component (Content) and make This componetn 100% dumb?

  const {
    limit,
    totalTracks,
    totalReleases,
    className = "",
    layout,
    countPageItemsFrom,
  } = props;

  let to;

  if (layout === "list") {
    to =
      countPageItemsFrom +
      (totalTracks - countPageItemsFrom >= limit
        ? limit - 1
        : totalTracks - countPageItemsFrom);
  } else {
    to =
      countPageItemsFrom +
      (totalReleases - countPageItemsFrom >= limit
        ? limit - 1
        : totalReleases - countPageItemsFrom);
  }

  const prevBtnActive = (
    <a href="#" className="link" onClick={props.handlePrevPageBtnClick}>
      <Arrow direction="left" /> Prev
    </a>
  );
  const prevBtnInactive = (
    <Fragment>
      <Arrow direction="left" /> Prev
    </Fragment>
  );

  const nextBtnActive = (
    <a href="#" className="link" onClick={props.handleNextPageBtnClick}>
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
        {countPageItemsFrom} - {to} of {layout ? totalReleases : totalTracks}
      </li>
      <li className="pagination__prev">
        {props.buttons.prev ? prevBtnActive : prevBtnInactive}
      </li>
      <li className="pagination__next">
        {props.buttons.next ? nextBtnActive : nextBtnInactive}
      </li>
    </ul>
  );
}
