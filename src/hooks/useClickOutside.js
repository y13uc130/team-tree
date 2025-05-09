import { useEffect } from "react";

export function useOnClickOutside({
  refs,
  handler,
  enabled = true,
  detectEscape = false,
}) {
  useEffect(() => {
    if (!enabled) return;

    function handleClickOutside(event) {
      const clickedInside = refs.some(
        (ref) => ref.current && ref.current.contains(event.target)
      );
      if (!clickedInside) {
        handler(event);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        handler(event);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    if (detectEscape) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      if (detectEscape) {
        document.removeEventListener("keydown", handleEscape);
      }
    };
  }, [refs, handler, enabled, detectEscape]);
}
