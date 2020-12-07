import React from "react";

import "./Error.scss";

interface ErrorProps extends React.HtmlHTMLAttributes<HTMLDivElement> {}

function Error(props: ErrorProps) {
  const { className = "error", children } = props;

  return <div className={className}>{children}</div>;
}

export { Error };
