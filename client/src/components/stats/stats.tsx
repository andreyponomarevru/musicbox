import React from "react";

import "./stats.scss";
import { DatabaseStats } from "../../types";

export type Props = {
  stats?: DatabaseStats;
  className?: string;
};

//

export function Stats(props: Props): JSX.Element | null {
  const { className = "" } = props;

  if (!props.stats) return null;

  const { tracks = "", releases = "" } = props.stats;

  return (
    <div className={`stats ${className}`}>
      <span className="stats__box">
        Your library contains <span className="stats__count"> {tracks} </span>{" "}
        tracks and <span className="stats__count"> {releases} </span> releases.
      </span>
    </div>
  );
}
