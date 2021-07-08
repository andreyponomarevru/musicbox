import React, { Component } from "react";

import { MusicboxLogo } from "../musicbox-logo/musicbox-logo";
import { Btn } from "../btn/btn";
import { SearchBar } from "../search-bar/search-bar";
import "./app-header.scss";

interface Props {
  className?: string;
  handleSearchInput: (input: string) => void;
  handleLogoClick: () => void;
}

export function AppHeader(props: Props): JSX.Element {
  const { className = "" } = props;

  return (
    <header className={`app-header ${className}`}>
      <MusicboxLogo
        handleLogoClick={props.handleLogoClick}
        className="app-header__logo"
        fill="white"
        height="1.5rem"
      />
      <SearchBar
        onSearchChange={props.handleSearchInput}
        className="app-header__search-bar"
      />
      {/*<nav className="app-header__controls app-header__controls_top">
        <Btn to="/release/add">Add Release</Btn>
			 </nav>*/}
    </header>
  );
}
