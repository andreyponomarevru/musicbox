import React, { Component } from "react";

interface SelectSortProps extends React.HTMLAttributes<HTMLDivElement> {}

function SelectSort(props: SelectSortProps) {
  const { className = "select-sort" } = props;

  return (
    <div className={className}>
      Sort{" "}
      <select>
        <option>Artist, A-Z</option>
        <option>Artist, Z-A</option>
        <option>Release Title, A-Z</option>
        <option>Release Title, Z-A</option>
        <option>Year, 0-9</option>
        <option>Year, 9-0</option>
      </select>
    </div>
  );
}

export { SelectSort };
