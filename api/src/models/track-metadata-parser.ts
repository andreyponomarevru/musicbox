import path from "path";

import * as mm from "music-metadata";
import Jimp from "jimp";
import { v4 as uuid } from "uuid";

import { logger } from "../config/logger";
import { buildImageFilePath, buildImageURL } from "../utility";
import { DEFAULT_COVER_URL } from "../config/constants";
import { Cover, ParsedTrack } from "../types";

export class TrackMetadataParser {
  private readonly filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async parseAudioFile(): Promise<ParsedTrack> {
    const trackMetadata = await mm.parseFile(this.filePath);

    const cover = this.parseCover(trackMetadata.common.picture);
    if (cover.data && cover.destinationFilepath) {
      await this.saveCover(cover.data, cover.destinationFilepath);
    }
    const extension = this.parseExtension(this.filePath);
    const duration = this.parseDuration(trackMetadata.format.duration);
    const bitrate = this.parseBitrate(trackMetadata.format.bitrate);
    const trackArtist = this.parseTrackArtist(trackMetadata.common.artists);
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
    const catNo = this.parseCatalogNumber(trackMetadata.common.catalognumber);

    const extendedMetadata = {
      filePath: this.filePath,
      coverPath: cover.url,
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

  private parseGenre(genre?: string[]): string[] {
    return this.parseArray(genre);
  }

  private parseLabel(label?: string): string {
    return this.parseString(label);
  }

  private parseYear(year?: number): number {
    return this.parseNumber(year);
  }

  private parseTrackTitle(title?: string): string {
    return this.parseString(title);
  }

  private parseDuration(duration?: number): number {
    return this.parseNumber(duration);
  }

  private parseBitrate(bitrate?: number): number {
    return this.parseNumber(bitrate);
  }

  private parseTrackArtist(artist?: string[]): string[] {
    return this.parseArray(artist);
  }

  private parseReleaseTitle(releaseTitle?: string): string {
    if (releaseTitle) {
      if (/Various - /.test(releaseTitle)) {
        return releaseTitle.split("Various - ")[1];
      } else return releaseTitle;
    } else return "Unknown";
  }

  private parseReleaseArtist(
    artistName?: string,
    releaseTitle?: string,
  ): string {
    logger.debug(`${this.filePath}: parsing releaseArtist...`);
    if (releaseTitle && /Various - /.test(releaseTitle)) {
      logger.debug(`${this.filePath}: releaseArtist assigned "Various"`);
      return "Various";
    } else if (artistName && artistName.length > 0) {
      logger.debug(`${this.filePath}: releaseArtist assigned ${artistName}`);
      return artistName;
    } else {
      logger.debug(`${this.filePath}: releaseArtist assigned "Unknown"`);
      return "Unknown";
    }
  }

  private parseExtension(filePath: string): string {
    return path.extname(filePath).slice(1);
  }

  private async saveCover(cover: Buffer, saveToPath: string): Promise<void> {
    const jimpCover = await Jimp.read(cover);
    await jimpCover.resize(300, 300).quality(60).writeAsync(saveToPath);
  }

  private parseCover(image?: mm.IPicture[]): Cover {
    const defaultCover: Cover = { url: DEFAULT_COVER_URL };
    if (!image) return defaultCover;

    const cover = image[0];
    const extension = cover.format.split("/")[1];
    if (extension === "gif") {
      logger.debug(
        `${this.filePath}: .gif album covers are not supported and replaced with default cover image.\nReason: when writing to disk, .gif images cause an error in image manipulation module Jimp (https://www.npmjs.com/package/jimp)`,
      );
      return defaultCover;
    }
    const fullname = `${uuid()}.${extension}`;
    const url = buildImageURL(fullname);
    const destinationFilepath = buildImageFilePath(fullname);

    const parsedCover: Cover = {
      data: cover.data,
      url,
      destinationFilepath,
    };

    return parsedCover;
  }

  private parseCatalogNumber(comment?: string[]): string | null {
    return Array.isArray(comment) && comment[0].length > 0 ? comment[0] : null;
  }

  private parseArray(arr?: string[]): string[] {
    if (Array.isArray(arr) && arr.length > 0 && arr[0].length > 0) {
      // filter out empty artist names
      const artists = arr.filter((str) => str !== "");
      return artists;
    } else {
      logger.debug(
        `${this.filePath}: ID3 tag value which is either not an array or an empty array is set to "Unknown"`,
      );
      return ["Unknown"];
    }
  }

  private parseNumber(num?: number): number {
    return num || 0;
  }
  private parseString(str?: string): string {
    return str || "Unknown";
  }
}
