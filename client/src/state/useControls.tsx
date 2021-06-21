import { useState, useEffect, useReducer } from "react";

type SelectItemsPerPage = {
  type: "SELECT_ITEMS_PER_PAGE";
  payload: { limit: number };
};
type SelectSort = {
  type: "SELECT_SORT";
  payload: { sort: string };
};
type ResetControls = {
  type: "RESET_CONTROLS";
};
type SetPagination = {
  type: "SET_PAGINATION";
  payload: { currentPage: number };
};
type SetCountPageItemsFrom = {
  type: "SET_COUNT_PAGE_ITEMS_FROM";
};

type Action =
  | SelectItemsPerPage
  | SelectSort
  | ResetControls
  | SetPagination
  | SetCountPageItemsFrom;
type State = {
  sort: string;
  limit: number;
  currentPage: number;
  countPageItemsFrom: number;
};

type Controls = [
  State,
  () => void,
  (payload: SelectItemsPerPage["payload"]) => void,
  (selected: string) => void,
  (payload: SetPagination["payload"]) => void
];

//

function controlsReducer(state: State, action: Action): State {
  switch (action.type) {
    case "RESET_CONTROLS":
      return {
        ...state,
        sort: "year,desc",
        limit: 25,
        currentPage: 1,
        countPageItemsFrom: 1,
      };
    case "SELECT_ITEMS_PER_PAGE":
      return {
        ...state,
        limit: action.payload.limit,
        currentPage: 1,
        countPageItemsFrom: 1,
      };
    case "SELECT_SORT":
      return {
        ...state,
        sort: action.payload.sort,
      };
    case "SET_PAGINATION": {
      const countPageItemsFrom =
        action.payload.currentPage > state.currentPage
          ? state.countPageItemsFrom + state.limit
          : state.countPageItemsFrom - state.limit;

      return {
        ...state,
        currentPage: action.payload.currentPage,
        countPageItemsFrom,
      };
    }
    default:
      throw new Error();
  }
}

export function useControls(): Controls {
  const initialState: State = {
    sort: "year,desc",
    limit: 25,
    currentPage: 1,
    countPageItemsFrom: 1,
  };

  const [state, dispatch] = useReducer(controlsReducer, initialState);

  // Reset controls when user switches between layouts: we need to reset "sort" key to default value 'year,desc' to prevent API request with invalid query params from select box
  const resetControls = () => {
    dispatch({ type: "RESET_CONTROLS" });
  };

  const selectSort = (selected: string) => {
    dispatch({ type: "SELECT_SORT", payload: { sort: selected } });
  };

  const selectItemsPerPage = (payload: SelectItemsPerPage["payload"]) => {
    dispatch({ type: "SELECT_ITEMS_PER_PAGE", payload: payload });
  };

  const setPagination = (payload: SetPagination["payload"]) => {
    dispatch({ type: "SET_PAGINATION", payload });
  };

  return [state, resetControls, selectItemsPerPage, selectSort, setPagination];
}
