import React, { useState } from "react";
import AppRoutes from "./routes";
import ScrollToTop from "./shared/components/ScrollToTop";
import SplashScreen from "./shared/components/SplashScreen";

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}
      <div className={splashDone ? "fs-app-ready" : "fs-app-booting"}>
        <ScrollToTop />
        <AppRoutes />
      </div>
    </>
  );
}
