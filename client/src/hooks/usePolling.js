import { useEffect, useRef } from "react";

// Calls `callback` on an interval for as long as the component is mounted,
// without needing to re-create the interval when the callback identity
// changes. Used to give pages a "live" feel (status changes, new booking
// requests, etc. show up without the user refreshing) without the added
// infrastructure of WebSockets.
export default function usePolling(callback, intervalMs = 5000) {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  });
  useEffect(() => {
    const id = setInterval(() => savedCallback.current(), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}
