import { Suspense } from "react";
import { Outlet } from "react-router";
import { usePreventSamePageNavigation } from "@/hooks/usePreventSamePageNavigation";
import SessionBootstrapSkeleton from "@/features/auth/components/SessionBootstrapSkeleton.jsx";

function RootLayout() {
  usePreventSamePageNavigation();
  return (
    <div>
      <Suspense fallback={<SessionBootstrapSkeleton />}>
        <Outlet />
      </Suspense>
    </div>
  );
}

export default RootLayout;
