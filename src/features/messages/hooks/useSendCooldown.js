import { useCallback, useEffect, useRef, useState } from "react";

export const DEFAULT_SEND_COOLDOWN_MS = 1500;

export function useSendCooldown(cooldownMs = DEFAULT_SEND_COOLDOWN_MS) {
  const [sendCooldownLeftMs, setSendCooldownLeftMs] = useState(0);
  const cooldownTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current);
      }
    };
  }, []);

  const startSendCooldown = useCallback(() => {
    if (cooldownTimerRef.current) {
      clearInterval(cooldownTimerRef.current);
    }
    const expiresAt = Date.now() + cooldownMs;
    setSendCooldownLeftMs(cooldownMs);
    cooldownTimerRef.current = setInterval(() => {
      const remaining = Math.max(0, expiresAt - Date.now());
      setSendCooldownLeftMs(remaining);
      if (remaining <= 0 && cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current);
        cooldownTimerRef.current = null;
      }
    }, 100);
  }, [cooldownMs]);

  return {
    sendCooldownLeftMs,
    startSendCooldown,
  };
}
