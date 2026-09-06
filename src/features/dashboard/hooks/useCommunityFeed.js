import { useEffect, useState } from "react";
import { fetchCommunityFeed } from "../api/communityService.js";

export function useCommunityFeed() {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    fetchCommunityFeed()
      .then((data) => {
        if (active) setState({ data, isLoading: false, error: null });
      })
      .catch((error) => {
        if (active) setState({ data: null, isLoading: false, error });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
