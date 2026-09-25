import { useState } from "react";
import { MOCK_CONVERSATIONS } from "../model/messagesData.js";

export function useMessages() {
  return useState({
    data: {
      conversations: MOCK_CONVERSATIONS,
    },
    isLoading: false,
    error: null,
  })[0];
}
