import React from "react";
import { useAuth } from "../../shared/hooks/useAuth";

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside>
      <div>{user?.name}</div>
      <div>{user?.initials}</div>
      <div>{user?.role}</div>
      <button type="button" onClick={logout}>
        Logout
      </button>
    </aside>
  );
}
