import path from "path";
import fs from "fs-extra";

import * as mm from "music-metadata";
import Jimp from "jimp";
import { v4 as uuid } from "uuid";

import { buildApiCoverPath, buildLocalCoverPath } from "../utility";
import { DEFAULT_COVER_URL } from "../config/constants";

import { TrackExtendedMeta } from "../types";

export class TrackMetadataParser {
  private readonly filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async parseAudioFile(): Promise<TrackExtendedMeta> {
    const trackMetadata = await mm.parseFile(this.filePath);

    const coverPath = await this.parseCover(
      this.filePath,
      trackMetadata.common.picture,
    );
    const extension = this.parseExtension(this.filePath);
    const duration = this.parseDuration(trackMetadata.format.duration);
    const bitrate = this.parseBitrate(trackMetadata.format.bitrate);
    const trackArtist = this.parseTrackArtist(trackMetadata.common.artist);
    const releaseArtist = this.parseReleaseArtist(
      trackMetadata.common.artist,
      trackMetadata.common.album,
    );
    const year = this.parseYear(trackMetadata.common.year);
    const trackNo = trackMetadata.common.track.no;
    const trackTitle = this.parseTrackTitle(trackMetadata.common.title);
    const releaseTitle = this.parseReleaseTitle(trackMetadata.common.album);
    const diskNo = trackMetadata.common.disk.no;
    const label = this.parseLabel(trackMetadata.common.copyright);
    const genre = this.parseGenre(trackMetadata.common.genre);
    const catNo = this.parseCommentToCatNo(trackMetadata.common.comment);

    const extendedMetadata: TrackExtendedMeta = {
      filePath: this.filePath,
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

  private parseDuration(duration?: number) {
    return duration || 0;
  }

  private parseBitrate(bitrate?: number) {
    return bitrate || 0;
  }

  private parseYear(year?: number) {
    return year || 0;
  }

  private parseLabel(name?: string) {
    return name || "Unknown";
  }

  private parseTrackTitle(title?: string) {
    return title || "";
  }

  private parseReleaseTitle(releaseTitle?: string) {
    if (releaseTitle) {
      if (/Various - /.test(releaseTitle)) {
        return releaseTitle.split("Various - ")[1];
      } else return releaseTitle;
    } else return "";
  }

  private parseTrackArtist(name?: string) {
    if (name === undefined) return ["Unknown"];
    else return [...name.split("; ")];
  }

  private parseReleaseArtist(artistName?: string, releaseTitle?: string) {
    if (releaseTitle) {
      if (/Various - /.test(releaseTitle)) return "Various";
      else if (artistName) return artistName.split("; ")[0];
      else return "Unknown";
    }
    return "Unknown";
  }

  private parseGenre(genre?: string[]) {
    if (Array.isArray(genre)) return [...genre[0].split("; ")];
    else return ["Unknown"];
  }

  private parseExtension(filePath: string) {
    return path.extname(filePath).slice(1);
  }

  private async parseCover(filePath: string, image?: mm.IPicture[]) {
    const coverName = path.parse(filePath).name;
    const coverMetadata = image ? { name: coverName, ...image[0] } : null;

    if (coverMetadata) {
      const extension = coverMetadata.format.split("/")[1];
      const fullname = `${uuid()}.${extension}`;

      const buffer = coverMetadata.data;
      const apiCoverPath = buildApiCoverPath(fullname);
      const localCoverPath = buildLocalCoverPath(fullname);

      await fs.writeFile(localCoverPath, buffer);
      await this.optimizeImage(localCoverPath);
      return apiCoverPath;
    } else {
      return DEFAULT_COVER_URL;
    }
  }

  private async optimizeImage(path: string) {
    const image = await Jimp.read(path);
    image.resize(450, 450).quality(60).write(path);
  }

  private parseCommentToCatNo(comment?: string[]) {
    if (Array.isArray(comment)) {
      const regex = /[\w\s{0,1}-]+/;
      const catNo = regex.exec(comment[0]);
      return catNo ? catNo[0] : null;
    } else {
      return null;
    }
  }
}
