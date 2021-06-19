import React from "react";

import "./loader.scss";

interface Props {
  className?: string;
}

export function Loader(props: Props) {
  const { className = "" } = props;

  return <div className={`"loader loader_blink" ${className}`}>Loading...</div>;
}
