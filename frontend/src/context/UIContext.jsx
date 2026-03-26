import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";

const UIContext = createContext(null);

const initialState = {
  pending: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "start":
      return { ...state, pending: state.pending + 1 };
    case "end":
      return { ...state, pending: Math.max(0, state.pending - 1) };
    default:
      return state;
  }
}

export function UIProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const withLoader = useCallback(async (fn) => {
    dispatch({ type: "start" });
    try {
      return await fn();
    } finally {
      dispatch({ type: "end" });
    }
  }, []);

  const value = useMemo(
    () => ({ pending: state.pending, withLoader }),
    [state.pending, withLoader]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const value = useContext(UIContext);
  if (!value) {
    throw new Error("useUI must be used within UIProvider");
  }

  return value;
}
