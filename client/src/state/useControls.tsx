import { useState, useEffect } from "react";

type Controls = {
  sort: string;
  limit: number;
  currentPage: number;
  countPageItemsFrom: number;
};

type Return = [
  Controls,
  React.Dispatch<React.SetStateAction<number>>,
  React.Dispatch<React.SetStateAction<string>>,
  React.Dispatch<React.SetStateAction<number>>,
  React.Dispatch<React.SetStateAction<number>>,
  () => void
];

export function useControls(): Return {
  const initialState: Controls = {
    sort: "year,desc",
    limit: 25,
    currentPage: 1,
    countPageItemsFrom: 1,
  };

  const [currentPage, setCurrentPage] = useState(initialState.currentPage);
  const [sort, setSort] = useState(initialState.sort);
  const [limit, setLimit] = useState(initialState.limit);
  const [countPageItemsFrom, setCountPageItemsFrom] = useState(
    initialState.countPageItemsFrom
  );

  // We reset controls when user switches between layouts. We also need to reset "sort" key to default value 'year,desc' to prevent API request with invalid query params from select box
  function resetControls() {
    setSort(initialState.sort);
    setLimit(initialState.limit);
    setCurrentPage(initialState.currentPage);
    setCountPageItemsFrom(initialState.countPageItemsFrom);
  }

  useEffect(() => {
    setCurrentPage(currentPage);
    setSort(sort);
    setLimit(limit);
    setCountPageItemsFrom(countPageItemsFrom);
  }, [currentPage, sort, limit, countPageItemsFrom]);

  return [
    { currentPage, sort, limit, countPageItemsFrom },
    setCurrentPage,
    setSort,
    setLimit,
    setCountPageItemsFrom,
    resetControls,
  ];
}
