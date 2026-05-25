import { useEffect, useState } from "react";

const SPLASH_VISIBLE_MS = 1200;
const SPLASH_FADE_MS = 450;

/**
 * Temporary branded splash — shown on initial app load, then fades out.
 * Remove this component from App.jsx when a real boot/loading flow exists.
 */
export default function SplashScreen({ onComplete }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setExiting(true), SPLASH_VISIBLE_MS);
    const doneTimer = window.setTimeout(
      () => onComplete?.(),
      SPLASH_VISIBLE_MS + SPLASH_FADE_MS,
    );

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fs-splash-screen ${exiting ? "fs-splash-screen--exit" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading FieldSync"
    >
      <div className="fs-splash-screen__glow" aria-hidden />

      <div className="fs-splash-screen__content">
        <div className="fs-splash-screen__logo-wrap">
          <div className="fs-splash-screen__logo" aria-hidden>
            FS
          </div>
        </div>

        <h1 className="fs-splash-screen__title">FieldSync</h1>
        <p className="fs-splash-screen__tagline">Operations Platform</p>

        <div className="fs-splash-screen__loader" aria-hidden>
          <span className="fs-splash-screen__loader-bar" />
        </div>
      </div>

      <p className="fs-splash-screen__footer">Field operations, coordinated.</p>
    </div>
  );
}
