import { useCallback, useEffect, useState } from "react";

/** Jalankan fungsi async dan expose {data, error, isLoading, refetch}. deps memicu re-fetch. */
export function useAsync(asyncFn, deps = []) {
  const [state, setState] = useState({ data: null, error: null, isLoading: true });

  const run = useCallback(() => {
    let cancelled = false;
    setState((s) => ({ ...s, isLoading: true }));
    asyncFn()
      .then((data) => {
        if (!cancelled) setState({ data, error: null, isLoading: false });
      })
      .catch((error) => {
        if (!cancelled) setState({ data: null, error, isLoading: false });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => run(), [run]);

  return { ...state, refetch: run };
}
