import React from "react";

import "./search-bar.scss";

interface Props {
  className: string;
  onSearchChange: (input: string) => void;
}

let timerId: NodeJS.Timeout;

export function SearchBar(props: Props): JSX.Element {
  const { className } = props;

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget.value;
    if (timerId) clearTimeout(timerId);

    if (input.length > 1) {
      timerId = setTimeout(() => props.onSearchChange(input), 700);
    }
  }

  return (
    <div className={`search-bar ${className}`}>
      <label className="search-bar__label" htmlFor="name">
        <input
          className="search-bar__input"
          type="text"
          id="name"
          name="name"
          placeholder="Search albums, artists and more"
          onChange={onChange}
        />
      </label>
    </div>
  );
}
