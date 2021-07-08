import { useState } from "react";

const { REACT_APP_API_ROOT } = process.env;
const SEARCH_API_URL = `${REACT_APP_API_ROOT}/search`;

type Search = [string, (query: string) => void];

export function useSearch(): Search {
  const [url, setUrl] = useState("");

  const setSearchQuery = (query: string) => {
    setUrl(`${SEARCH_API_URL}?q=${query}&`);
  };

  return [url, setSearchQuery];
}
