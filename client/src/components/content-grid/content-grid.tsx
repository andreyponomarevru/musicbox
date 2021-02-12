import React, { Component } from "react";

import { ReleaseMetadata } from "../../types";
import { Release } from "../release/release";

import "./content-grid.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  releases: ReleaseMetadata[];
  handleDeleteReleaseBtnClick: (releaseId: number) => void;
}

class ContentGrid extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <main className="content-grid">
        {...this.props.releases.map((release) => {
          return (
            <Release
              metadata={release}
              releaseId={release.id}
              key={release.id.toString()}
              handleDeleteReleaseBtnClick={
                this.props.handleDeleteReleaseBtnClick
              }
            />
          );
        })}
      </main>
    );
  }
}

export { ContentGrid };
