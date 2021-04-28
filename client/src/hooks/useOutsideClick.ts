import { useEffect, useRef } from "react";

export default function useOutsideClick<E extends HTMLElement>(
  onOutsideClick: () => unknown,
  dependencies: any[] = []
) {
  const rootRef = useRef<E>(null);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Stop if the click was inside the element
      if (rootRef.current?.contains(e.target as Node)) {
        return;
      }

      // Trigger the outside click handle otherwise
      onOutsideClick();
    };

    window.addEventListener("mousedown", handleDocumentClick, false);

    // returned function will be called on component unmount
    return () => {
      window.removeEventListener("mousedown", handleDocumentClick, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, onOutsideClick]);

  return rootRef;
}
