import { useEffect, useReducer } from "react";

type FetchInit = {
  type: "FETCH_INIT";
};
type FetchSuccess<T> = {
  type: "FETCH_SUCCESS";
  payload: APIResponse<T>["response"];
};
type FetchFailure<T> = {
  type: "FETCH_FAILURE";
  error: APIResponse<T>["error"];
};

type Action<T> = FetchInit | FetchSuccess<T> | FetchFailure<T>;
type State<T> = APIResponse<T>;

//

export function dataFetchReducer<T>(
  state: State<T>,
  action: Action<T>
): State<T> {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        error: null,
        response: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    default:
      throw new Error();
  }
}

export function useFetch<T>(url: string, options?: RequestInit): State<T> {
  const initialState: State<T> = {
    isLoading: false,
    error: null,
    response: null,
  };

  const [state, dispatch] = useReducer(dataFetchReducer, initialState);

  useEffect(() => {
    // prevent sending the request if component is unmounted or error cought
    let didCancel = false;

    async function fetchData() {
      dispatch({ type: "FETCH_INIT" });

      try {
        const res: T = await (await fetch(url, options)).json();

        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: res });
        }
      } catch (err) {
        if (!didCancel) dispatch({ type: "FETCH_FAILURE", error: err });
      }
    }

    fetchData();

    // when component is unmounted reset didCancel
    return () => {
      didCancel = true;
    };
  }, [url]);

  return state as APIResponse<T>;
}
