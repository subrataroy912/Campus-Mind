import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./index.css";
import { AppRoutes } from "./routes/AppRoutes.jsx";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import { maintenanceMode } from "./config/appConfig.js";
import ServerDown from "./pages/ServerDown.jsx";
import { Toaster } from "@/components/ui/toast.jsx";
import { baseApi } from "./app/baseApi.js";
import { getEventRefreshTargets } from "./features/events/refreshEvents.js";
import { reportWebVitals } from "./utils/reportWebVitals.js";

try {
  const savedTheme = localStorage.getItem("campus-mind.theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else if (savedTheme === "light") {
    document.documentElement.classList.remove("dark");
  }
} catch {
  // ignore storage errors
}

if (maintenanceMode && import.meta.env.DEV) {
  console.log("Application is in maintenance mode!");
}

window.addEventListener("campusmind:lifecycle-refresh", (event) => {
  const eventName = event?.detail?.eventName;
  const targets = getEventRefreshTargets(eventName);
  if (!eventName || !targets.length) return;
  store.dispatch(baseApi.util.invalidateTags(targets));
});

createRoot(document.getElementById("root")).render(
  <>
    {maintenanceMode ? (
      <ServerDown />
    ) : (
      <Provider store={store}>
        <TooltipProvider>
          <Toaster />
          <RouterProvider router={AppRoutes} />
        </TooltipProvider>
      </Provider>
    )}
  </>
);

reportWebVitals();
