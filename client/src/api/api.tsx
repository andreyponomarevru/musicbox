import {
  PaginatedAPIResponse,
  ReleaseMetadata,
  TrackExtendedMetadata,
  APIResponse,
  DatabaseStats,
  Stats,
} from "../types";

const { REACT_APP_API_ROOT } = process.env;

//

type ReleasesResponse = Promise<PaginatedAPIResponse<ReleaseMetadata[]>>;

export async function getReleases(
  sort: string,
  limit: number,
  page: number
): ReleasesResponse {
  const apiUrl = `${REACT_APP_API_ROOT}/releases?sort=${sort}&page=${page}&limit=${limit}`;

  const res: PaginatedAPIResponse<ReleaseMetadata[]> = await (
    await fetch(apiUrl)
  ).json();

  return res;
}

type TracksResponse = Promise<PaginatedAPIResponse<TrackExtendedMetadata[]>>;

export async function getTracks(
  sort: string,
  limit: number,
  page: number
): TracksResponse {
  const apiUrl = `${REACT_APP_API_ROOT}/tracks?sort=${sort}&page=${page}&limit=${limit}`;

  const res: PaginatedAPIResponse<TrackExtendedMetadata[]> = await (
    await fetch(apiUrl)
  ).json();

  return res;
}

type StatsResponse = Promise<APIResponse<DatabaseStats>>;

export async function getStats(): StatsResponse {
  const apiUrl = `${REACT_APP_API_ROOT}/stats`;
  const res: APIResponse<DatabaseStats> = await (await fetch(apiUrl)).json();
  return res;
}

type YearsResponse = Promise<APIResponse<Stats[]>>;

export async function getYears(): YearsResponse {
  const apiUrl = `${REACT_APP_API_ROOT}/stats/years`;
  const res: APIResponse<Stats[]> = await (await fetch(apiUrl)).json();
  return res;
}

type GenresResponse = Promise<APIResponse<Stats[]>>;

export async function getGenres(): GenresResponse {
  const apiUrl = `${REACT_APP_API_ROOT}/stats/genres`;
  const res: APIResponse<Stats[]> = await (await fetch(apiUrl)).json();
  return res;
}

type ArtistsResponse = Promise<APIResponse<Stats[]>>;

export async function getArtists(): ArtistsResponse {
  const apiUrl = `${REACT_APP_API_ROOT}/stats/artists`;
  const res: APIResponse<Stats[]> = await (await fetch(apiUrl)).json();
  return res;
}

type LabelsResponse = Promise<APIResponse<Stats[]>>;

export async function getLabels(): LabelsResponse {
  const apiUrl = `${REACT_APP_API_ROOT}/stats/labels`;
  const res: APIResponse<Stats[]> = await (await fetch(apiUrl)).json();
  return res;
}

export async function getSearchedTracks(input: string): TracksResponse {
  const apiUrl = `${REACT_APP_API_ROOT}/search?q=${input}&page=1&limit=50`;
  const res: PaginatedAPIResponse<TrackExtendedMetadata[]> = await (
    await fetch(apiUrl)
  ).json();
  return res;
}
