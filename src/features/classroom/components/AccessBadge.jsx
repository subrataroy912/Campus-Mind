import { Globe, KeyRound, Lock } from "lucide-react";

export const ACCESS_TYPES = Object.freeze({
  OPEN: "OPEN",
  CODE: "CODE",
  INVITE: "INVITE",
});

export function AccessBadge({ accessType = ACCESS_TYPES.OPEN, className = "" }) {
  const normalized = (accessType || ACCESS_TYPES.OPEN).toUpperCase();

  if (normalized === ACCESS_TYPES.INVITE) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-zinc-900/80 text-zinc-100 backdrop-blur-xs border border-white/10 shadow-xs ${className}`}
      >
        <Lock size={10} aria-hidden="true" />
        <span>Invite only</span>
      </span>
    );
  }

  if (normalized === ACCESS_TYPES.CODE) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-amber-600/90 text-white backdrop-blur-xs shadow-xs ${className}`}
      >
        <KeyRound size={10} aria-hidden="true" />
        <span>Code</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-600/90 text-white backdrop-blur-xs shadow-xs ${className}`}
    >
      <Globe size={10} aria-hidden="true" />
      <span>Public</span>
    </span>
  );
}

export default AccessBadge;