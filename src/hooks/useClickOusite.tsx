import type { RefObject } from "react";
import { useEffect, useRef } from "react";

/**
 * Hook for checking when the user clicks outside the passed ref
 */
export function useClickOutside({
  ref,
  callback,
  enabled,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: RefObject<any>;
  callback: () => void;
  enabled: boolean;
}) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  useEffect(() => {
    if (!enabled) {
      return;
    }
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (ref.current && !ref.current.contains(event.target)) {
        callbackRef.current();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, enabled]);
}
