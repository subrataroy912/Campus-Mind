// src/hooks/usePreventSamePageNavigation.js
import { useEffect } from "react";
import { useLocation } from "react-router";

export function usePreventSamePageNavigation() {
  const location = useLocation();

  useEffect(() => {
    const handleGlobalClick = (event) => {
      // Find closest <a> or <Link> tag from clicked target
      const anchor = event.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http")) return;

      const currentPath = `${location.pathname}${location.search}`;

      // If user clicks a link pointing to the exact same page, stop it
      if (href === currentPath || href === location.pathname) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.addEventListener("click", handleGlobalClick, true); // capture phase
    return () => document.removeEventListener("click", handleGlobalClick, true);
  }, [location.pathname, location.search]);
}