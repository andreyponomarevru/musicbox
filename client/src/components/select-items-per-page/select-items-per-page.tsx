import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  onSelectItemsPerPageChange: (controlName: string, value: number) => void;
}

export function SelectItemsPerPage(props: Props) {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    props.onSelectItemsPerPageChange(e.target.name, parseInt(e.target.value));
  }

  const { className = "select-items-per-page" } = props;

  return (
    <div className={className}>
      Show{" "}
      <select
        name="limit"
        className="select-items-per-page__box"
        onChange={handleChange}
        value={props.value}
      >
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="250">250</option>
        <option value="500">500</option>
      </select>
    </div>
  );
}
