import React from "react";

import "./loader.scss";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Loader(props: LoaderProps) {
  const { className = "loader loader_blink" } = props;

  return <div className={className}>Loading...</div>;
}
