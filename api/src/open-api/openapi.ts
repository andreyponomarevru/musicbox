import * as artists from "./artists";
import * as genres from "./genres";
import * as labels from "./labels";
import * as years from "./years";
import * as stats from "./stats";
import * as releases from "./releases";
import * as tracks from "./tracks";
import * as search from "./search";

// Spec: https://swagger.io/specification/

export const swaggerDocument = {
  openapi: "3.0.1",
  info: {
    version: "1.0.0",
    title: "Musicbox API Doc",
    description: "Documentation for Musicbox API",
    contact: {
      name: "Andrey Ponomarev",
      email: "info@andreyponomarev.ru",
      url: "https://andreyponomarev.ru",
    },
  },
  servers: [
    { url: "http://musicbox.com:8000/api/v1", description: "Local server" },
  ],
  paths: {
    "/artists": {
      get: artists.getArtists,
    },
    "/genres": {
      get: genres.getGenres,
    },
    "/labels": {
      get: labels.getLabels,
    },
    "/years": {
      get: years.getYears,
    },
    "/stats": {
      get: stats.getStats,
    },
    "/stats/genres": {
      get: stats.getGenresStats,
    },
    "/stats/artists": {
      get: stats.getArtistsStats,
    },
    "/stats/labels": {
      get: stats.getLabelsStats,
    },
    "/stats/years": {
      get: stats.getYearsStats,
    },
    "/releases": {
      get: releases.getReleases,
      post: releases.createRelease,
    },
    "/releases/{releaseId}": {
      get: releases.getRelease,
      delete: releases.deleteRelease,
      put: releases.updateRelease,
    },
    "/releases/{releaseId}/tracks": {
      get: releases.getReleaseTracks,
    },
    "/tracks": {
      get: tracks.getTracks,
      post: tracks.createTrack,
    },
    "/tracks/{trackId}": {
      delete: tracks.deleteTrack,
      put: tracks.updateTrack,
    },
    "/tracks/{trackId}/stream": {
      get: tracks.streamTrack,
    },
    "/search": {
      get: search.findTracks,
    },
    /*
    "/releases/{releaseId}": {
      get: {},
    },*/
    //"/tracks?limit=###": {}, // checkout |Parameters Object| on swagger doc
  },
  components: {
    schemas: {
      release: {
        type: "object",
        properties: {
          id: { type: "number" },
          artist: { type: "string" },
          catNo: { type: "string", nullable: true },
          coverPath: { type: "string" },
          label: { type: "string" },
          title: { type: "string" },
          year: { type: "number" },
        },
      },
      track: {
        type: "object",
        properties: {
          bitrate: { type: "number" },
          catNo: { type: "string", nullable: true },
          coverPath: { type: "string" },
          diskNo: { type: "number", nullable: true },
          duration: { type: "number" },
          extension: { type: "string" },
          filePath: { type: "string" },
          genre: { type: "array", items: { type: "string" } },
          label: { type: "string" },
          releaseArtist: { type: "string" },
          releaseId: { type: "number" },
          releaseTitle: { type: "string" },
          trackArtist: { type: "array", items: { type: "string" } },
          trackId: { type: "number" },
          trackNo: { type: "number", nullable: true },
          trackTitle: { type: "string" },
          year: { type: "number" },
        },
      },
      error: {
        type: "object",
        properties: {
          errorCode: { type: "number" },
          message: { type: "string" },
          more_info: { type: "string" },
        },
      },
    },
  },
};
