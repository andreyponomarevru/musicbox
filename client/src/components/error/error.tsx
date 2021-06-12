import React from "react";

import "./error.scss";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function Error(props: Props) {
  const { className = "", children } = props;

  return <span className={`error ${className}`}>{children}</span>;
}
