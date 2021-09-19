import NProgress from "accessible-nprogress";
import { useEffect } from "react";

NProgress.configure({ showSpinner: false });

export default function useNProgress(isActive: boolean) {
  useEffect(() => {
    if (isActive) {
      NProgress.start();
    } else {
      NProgress.done();
    }

    return () => {
      NProgress.done();
    };
  }, [isActive]);
}
