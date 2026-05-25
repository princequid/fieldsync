import { useEffect, useRef, useState } from "react";
import { scrollAppToTop } from "./ScrollToTop";

const ENTER_MS = 280;

/**
 * Smooth route transitions — single enter animation per navigation,
 * no full hide/show flash.
 */
export default function PageTransitionWrapper({
  transitionKey,
  children,
  className = "",
}) {
  const [displayedChildren, setDisplayedChildren] = useState(children);
  const [animating, setAnimating] = useState(false);
  const latestChildrenRef = useRef(children);
  const isFirstRender = useRef(true);

  useEffect(() => {
    latestChildrenRef.current = children;
  }, [children]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      scrollAppToTop();
      return;
    }

    scrollAppToTop();
    setAnimating(true);
    setDisplayedChildren(latestChildrenRef.current);

    const timer = window.setTimeout(() => setAnimating(false), ENTER_MS);
    return () => window.clearTimeout(timer);
  }, [transitionKey]);

  return (
    <div
      className={[
        "fs-page-transition",
        animating ? "fs-page-transition--enter" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {displayedChildren}
    </div>
  );
}
