import React from "react";

import { Arrow } from "../arrow/arrow";
import "./pagination.scss";

interface Props {
  limit: number; // items per page
  totalItems: number;

  handleNextPageBtnClick: () => void;
  handlePrevPageBtnClick: () => void;

  buttons: { prev: boolean; next: boolean };

  countPageItemsFrom: number;
  className?: string;
}

export function Pagination(props: Props): JSX.Element {
  const { limit, totalItems, className = "", countPageItemsFrom } = props;

  const to =
    countPageItemsFrom +
    (totalItems - countPageItemsFrom >= limit
      ? limit - 1
      : totalItems - countPageItemsFrom);

  const prevBtn = (
    <button
      disabled={!props.buttons.prev}
      type="button"
      className={`pagination__btn ${
        props.buttons.prev ? "" : "pagination__btn_disabled"
      }`}
      onClick={props.handlePrevPageBtnClick}
    >
      <Arrow direction="left" /> Prev
    </button>
  );

  const nextBtn = (
    <button
      disabled={!props.buttons.next}
      type="button"
      className={`pagination__btn ${
        props.buttons.next ? "" : "pagination__btn_disabled"
      }`}
      onClick={props.handleNextPageBtnClick}
    >
      Next <Arrow direction="right" />
    </button>
  );

  return (
    <ul className={`pagination ${className}`}>
      <li className="pagination__current-page">
        {countPageItemsFrom} - {to} of {totalItems}
      </li>
      <li>
        <span>{prevBtn}</span>
        <span>{nextBtn}</span>
      </li>
    </ul>
  );
}
