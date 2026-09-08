import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./index.css";
import { AppRoutes } from "./routes/AppRoutes.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import { maintenanceMode } from "./config/appConfig.js";
import ServerDown from "./pages/ServerDown.jsx";

if (maintenanceMode && import.meta.env.DEV) {
  console.log("Application is in maintenance mode!");
}
createRoot(document.getElementById("root")).render(
  <>
    {maintenanceMode ? (
      <ServerDown />
    ) : (
      <Provider store={store}>
        <TooltipProvider>
          <AuthProvider>
            <Suspense fallback={<div>Loading CampusMind…</div>}>
              <RouterProvider router={AppRoutes} />
            </Suspense>
          </AuthProvider>
        </TooltipProvider>
      </Provider>
    )}
  </>,
);
