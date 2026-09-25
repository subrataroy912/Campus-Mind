import { Suspense } from "react";
import { Outlet } from "react-router";
import { usePreventSamePageNavigation } from "@/hooks/usePreventSamePageNavigation";
import SessionBootstrapSkeleton from "@/features/auth/components/SessionBootstrapSkeleton.jsx";

function RootLayout({ children }) {
  usePreventSamePageNavigation();
  return (
    <div>
      <Suspense fallback={<SessionBootstrapSkeleton />}>
        {children ?? <Outlet />}
      </Suspense>
    </div>
  );
}

export default RootLayout;
