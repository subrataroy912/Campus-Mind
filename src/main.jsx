import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./index.css";
import { AppRoutes } from "./routes/AppRoutes.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { TooltipProvider } from "@/components/ui/tooltip";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TooltipProvider>
      <AuthProvider>
        <Suspense
          fallback={
            <div
              className="grid min-h-screen place-items-center bg-background px-4 text-center text-sm font-medium text-muted-foreground"
              role="status"
            >
              Loading CampusMind…
            </div>
          }
        >
          <RouterProvider router={AppRoutes} />
        </Suspense>
      </AuthProvider>
    </TooltipProvider>
  </StrictMode>,
);
