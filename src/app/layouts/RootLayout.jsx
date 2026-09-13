import { usePreventSamePageNavigation } from "@/hooks/usePreventSamePageNavigation";
import React from "react";
import { Outlet } from "react-router";

function RootLayout() {
  usePreventSamePageNavigation();
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default RootLayout;
