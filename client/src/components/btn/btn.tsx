import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import "./btn.scss";

interface Props extends React.HTMLAttributes<HTMLLinkElement> {
  href: string;
  text: string;
  handleClick?: (e: any) => void;
}

function Btn(props: Props) {
  const { className, href, text } = props;

  return (
    <NavLink to={href} className={className} onClick={props.handleClick}>
      {text}
    </NavLink>
  );
}

export { Btn };
