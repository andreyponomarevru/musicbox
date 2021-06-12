import path from "path";
import fs from "fs-extra";

import * as mm from "music-metadata";
import Jimp from "jimp";
import { v4 as uuid } from "uuid";

import { buildApiCoverPath, buildLocalCoverPath } from "../utility";
import { DEFAULT_COVER_URL } from "../config/constants";

import { TrackExtendedMeta } from "../types";

export class TrackMetadataParser {
  private _filePath: string;

  constructor(filePath: string) {
    this._filePath = filePath;
  }

  async parseAudioFile() {
    const trackMetadata = await mm.parseFile(this._filePath);

    const coverPath = await this._parseCover(
      this._filePath,
      trackMetadata.common.picture,
    );
    const extension = this._parseExtension(this._filePath);
    const duration = this._parseDuration(trackMetadata.format.duration);
    const bitrate = this._parseBitrate(trackMetadata.format.bitrate);
    const trackArtist = this._parseTrackArtist(trackMetadata.common.artist);
    const releaseArtist = this._parseReleaseArtist(
      trackMetadata.common.artist,
      trackMetadata.common.album,
    );
    const year = this._parseYear(trackMetadata.common.year);
    const trackNo = this._parseTrackNo(trackMetadata.common.track.no);
    const trackTitle = this._parseTrackTitle(trackMetadata.common.title);
    const releaseTitle = this._parseReleaseTitle(trackMetadata.common.album);
    const diskNo = this._parseDiskNo(trackMetadata.common.disk.no);
    const label = this._parseLabel(trackMetadata.common.copyright);
    const genre = this._parseGenre(trackMetadata.common.genre);
    const catNo = this._parseCommentToCatNo(trackMetadata.common.comment);

    const extendedMetadata: TrackExtendedMeta = {
      filePath: this._filePath,
      coverPath,
      extension,
      duration,
      bitrate,
      releaseArtist,
      trackArtist,
      year,
      trackNo,
      trackTitle,
      releaseTitle,
      diskNo,
      label,
      genre,
      catNo,
    };

    return extendedMetadata;
  }

  private _parseDuration(duration: number | undefined) {
    return duration || 0;
  }

  private _parseBitrate(bitrate: number | undefined) {
    return bitrate || 0;
  }

  private _parseYear(year: number | undefined) {
    return year || 0;
  }

  private _parseLabel(name: string | undefined) {
    return name || "Unknown";
  }

  private _parseTrackTitle(title: string | undefined) {
    return title || "";
  }

  private _parseDiskNo(diskNo: number | undefined) {
    return diskNo || null;
  }

  private _parseTrackNo(no: number | undefined) {
    return no || null;
  }

  private _parseReleaseTitle(releaseTitle: string | undefined) {
    if (releaseTitle) {
      if (/Various - /.test(releaseTitle)) {
        return releaseTitle.split("Various - ")[1];
      } else return releaseTitle;
    } else return "";
  }

  private _parseTrackArtist(name: string | undefined) {
    if (name === undefined) return ["Unknown"];
    else return [...name.split("; ")];
  }

  private _parseReleaseArtist(
    artistName: string | undefined,
    releaseTitle: string | undefined,
  ) {
    if (releaseTitle) {
      if (/Various - /.test(releaseTitle)) {
        return "Various";
      } else if (artistName) {
        return artistName.split("; ")[0];
      } else return "Unknown";
    }
    return "Unknown";
  }

  private _parseGenre(genre: string[] | undefined) {
    if (Array.isArray(genre)) return [...genre[0].split("; ")];
    else return ["Unknown"];
  }

  private _parseExtension(filePath: string) {
    return path.extname(filePath).slice(1);
  }

  private async _parseCover(
    filePath: string,
    image: mm.IPicture[] | undefined,
  ) {
    const coverName = path.parse(filePath).name;
    const coverMetadata = image ? { name: coverName, ...image[0] } : null;

    if (coverMetadata) {
      const extension = coverMetadata.format.split("/")[1];
      const fullname = `${uuid()}.${extension}`;

      const buffer = coverMetadata.data;
      const apiCoverPath = buildApiCoverPath(fullname);
      const localCoverPath = buildLocalCoverPath(fullname);

      await fs.writeFile(localCoverPath, buffer);
      await this._optimizeImage(localCoverPath);
      return apiCoverPath;
    } else {
      return DEFAULT_COVER_URL;
    }
  }

  private async _optimizeImage(path: string) {
    const image = await Jimp.read(path);
    image.resize(450, 450).quality(60).write(path);
  }

  private _parseCommentToCatNo(comment: string[] | undefined) {
    if (Array.isArray(comment)) {
      const regex = /[\w\s{0,1}-]+/;
      const catNo = regex.exec(comment[0]);

      return catNo ? catNo[0] : null;
    } else return null;
  }
}
