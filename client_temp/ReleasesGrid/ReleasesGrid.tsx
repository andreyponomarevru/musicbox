import React, { Component } from "react";
import PropTypes from "prop-types";

import Icon from "../Icon/Icon";
import "./ReleasesGrid.scss";
import ReleaseBox from "../ReleaseBox/ReleaseBox";

import img1 from "./../../api/img/001.jpg";
import img2 from "./../../api/img/002.jpg";
import img3 from "./../../api/img/003.jpg";
import img4 from "./../../api/img/004.jpg";
import img5 from "./../../api/img/005.jpg";
import img6 from "./../../api/img/006.jpg";
import img7 from "./../../api/img/007.jpg";
import img8 from "./../../api/img/008.jpg";
import img9 from "./../../api/img/009.jpg";
import img10 from "./../../api/img/010.jpg";
import img11 from "./../../api/img/011.jpg";
import img12 from "./../../api/img/012.jpg";
import img13 from "./../../api/img/013.jpg";

class ReleasesGrid extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  render() {
    const imgURLs = [
      img1,
      img2,
      img3,
      img4,
      img5,
      img6,
      img7,
      img8,
      img9,
      img10,
      img11,
      img12,
      img13,
    ];

    const releaseBoxes = imgURLs.map((url, index) => (
      <ReleaseBox key={index} className="ReleaseBox" cover={url} />
    ));

    return (
      <div className={this.props.className}>
        <ReleaseBox
          className="ReleaseBox"
          cover={img2}
          artistName="The Future Sound Of London"
          releaseName="Papua New Guinea"
        />
        <ReleaseBox
          className="ReleaseBox"
          cover={img5}
          artistName="Philippe Baden Powell"
          releaseName="Notes over Poetry - Album"
        />
        <ReleaseBox
          className="ReleaseBox"
          cover={img3}
          artistName="Rene & Angela"
          releaseName="In Your Eyes"
        />
        <ReleaseBox
          className="ReleaseBox"
          cover={img4}
          artistName="Damar Luis"
          releaseName="Tsunami"
        />
        {releaseBoxes}
        {releaseBoxes}
      </div>
    );
  }

  static propTypes = {
    className: PropTypes.string,
  };
}

export default ReleasesGrid;
