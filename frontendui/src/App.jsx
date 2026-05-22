import React from "react";
import AppRoutes from "./routes";
import ScrollToTop from "./shared/components/ScrollToTop";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <AppRoutes />
    </>
  );
}
