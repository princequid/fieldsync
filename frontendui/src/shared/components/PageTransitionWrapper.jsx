import { useEffect, useRef, useState } from "react";

const EXIT_MS = 150;

export default function PageTransitionWrapper({
  transitionKey,
  children,
  className = "",
}) {
  const [displayedChildren, setDisplayedChildren] = useState(children);
  const [phase, setPhase] = useState("pre-enter");
  const latestChildrenRef = useRef(children);
  const timeoutRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    latestChildrenRef.current = children;
  }, [children]);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => setPhase("entered"));
    return () => window.cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    setPhase("exiting");

    timeoutRef.current = window.setTimeout(() => {
      setDisplayedChildren(latestChildrenRef.current);
      setPhase("pre-enter");
      requestAnimationFrame(() => {
        setPhase("entered");
      });
    }, EXIT_MS);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [transitionKey]);

  return (
    <div
      className={`${className} ${phase === "entered" ? "animate-slide-up" : ""}`.trim()}
      style={{
        opacity: phase === "pre-enter" || phase === "exiting" ? 0 : 1,
        transform: phase === "pre-enter" ? "translateY(6px)" : "translateY(0)",
        transition:
          phase === "exiting"
            ? "opacity 150ms ease-out"
            : "opacity 220ms ease-out, transform 220ms ease-out",
      }}
    >
      {displayedChildren}
    </div>
  );
}
