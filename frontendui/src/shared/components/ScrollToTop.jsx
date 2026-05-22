import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Reset scroll position for full-page and layout scroll containers. */
export function scrollAppToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  document.querySelectorAll("main").forEach((el) => {
    el.scrollTop = 0;
  });
}

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollAppToTop();
  }, [pathname]);

  return null;
}
