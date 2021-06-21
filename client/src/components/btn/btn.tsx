import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import "./btn.scss";

interface Props extends React.HTMLAttributes<HTMLLinkElement> {
  to: string;
  children: React.ReactNode;
  className?: string;
}

function Btn(props: Props) {
  const { className = "", to, children } = props;

  return (
    <NavLink to={to} className={`btn btn_theme_empty ${className}`}>
      {children}
    </NavLink>
  );
}

export { Btn };
