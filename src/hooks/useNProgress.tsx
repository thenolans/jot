import NProgress from "accessible-nprogress";
import { MutableRefObject, useEffect, useRef } from "react";

NProgress.configure({ showSpinner: false });

const refs = new Set<MutableRefObject<boolean>>();

function updateNProgress() {
  // @ts-expect-error
  if ([...refs.values()].some((ref) => ref.current)) {
    NProgress.start();
  } else {
    NProgress.done();
  }
}

export default function useNProgress(isActive: boolean) {
  const ref = useRef(isActive);

  useEffect(() => {
    refs.add(ref);
    return () => {
      refs.delete(ref);
      updateNProgress();
    };
  }, []);

  useEffect(() => {
    ref.current = isActive;
    updateNProgress();
  }, [isActive]);
}
