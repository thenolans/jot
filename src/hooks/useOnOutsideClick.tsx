import { useEffect } from "react";

const useOnOutsideClick = (
  ref: React.MutableRefObject<HTMLElement> | React.MutableRefObject<null>,
  onOutsideClick?: () => void
) => {
  useEffect(() => {
    if (onOutsideClick) {
      const handleClickOutside = (event: MouseEvent) => {
        event.stopPropagation();
        if (ref?.current && !ref.current.contains(event.target as Node)) {
          onOutsideClick?.();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
    return () => {};
  }, [ref, onOutsideClick]);
};

export default useOnOutsideClick;
