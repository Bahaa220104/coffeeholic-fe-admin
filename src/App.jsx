import * as React from "react";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./utilities/contexts/auth.context";

export default function App() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
