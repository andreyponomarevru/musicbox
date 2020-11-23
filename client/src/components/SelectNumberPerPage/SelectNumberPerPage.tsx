import React, { Component } from "react";

interface SelectNumberPerPageProps
  extends React.HTMLAttributes<HTMLDivElement> {}

function SelectNumberPerPage(props: SelectNumberPerPageProps) {
  const { className = "select-number-per-page" } = props;

  return (
    <div className={className}>
      Show{" "}
      <select>
        <option>25</option>
        <option>50</option>
        <option>100</option>
        <option>250</option>
        <option>500</option>
      </select>
    </div>
  );
}

export { SelectNumberPerPage };
