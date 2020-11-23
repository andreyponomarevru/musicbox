import React from "react";

import { Arrow } from "./../Arrow/Arrow";

import "./Pagination.scss";

interface PaginationProps extends React.HTMLAttributes<HTMLUListElement> {
  limit: string;
}

function Pagination(props: PaginationProps) {
  const { limit, className = "pagination" } = props;

  return (
    <ul className={className}>
      <li className="pagination__limit">{limit}</li>
      <li className="pagination__prev">
        <a href="#" className="link">
          <Arrow direction="left" /> Prev
        </a>
      </li>
      <li className="pagination__next">
        <a href="#" className="link">
          Next <Arrow direction="right" />
        </a>
      </li>
    </ul>
  );
}

export { Pagination };
