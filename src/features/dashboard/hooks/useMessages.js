import { useState } from "react";

export function useMessages() {
  return useState({
    data: null,
    isLoading: false,
    error: null,
  })[0];
}
