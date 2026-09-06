import { useEffect, useState } from "react";
import { fetchConversations } from "../api/messageService.js";

export function useMessages() {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    fetchConversations()
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
