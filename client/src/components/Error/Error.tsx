import React from "react";

import "./Error.scss";

interface ErrorProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  errorMsg: string;
}

function Error(props: ErrorProps) {
  const { className = "error", errorMsg } = props;

  return <div className={className}>{errorMsg}</div>;
}

export { Error };
