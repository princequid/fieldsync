import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";

export default function AdminLayout() {
  return (
    <div>
      <Sidebar />
      <Outlet />
    </div>
  );
}
