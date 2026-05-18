import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
export default function AdminLayout({ children }) {
  return (
    <div>
      <Navbar />
      <Sidebar />
      {children}
    </div>
  );
}
