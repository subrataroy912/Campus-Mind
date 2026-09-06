import { useState, useRef } from "react";
import { useSearchParams } from "react-router";
import { findClassroomByCode, joinClassroom } from "../api/classroomService";
import { useAuth } from "@/context/AuthContext.jsx";
import { CLASS_CODE_LENGTH, formatClassCode, normalizeClassCode } from "@/utils/classCode.js";

export default function JoinClass() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const initialCode = normalizeClassCode(searchParams.get("code") || "");
  const [code, setCode] = useState(() => Array.from({ length: CLASS_CODE_LENGTH }, (_, index) => initialCode[index] || ""));
  const [status, setStatus] = useState("idle"); // idle | loading | found | not-found | joined
  const [foundClass, setFoundClass] = useState(null);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);



  const handleChange = (index, value) => {
    const clean = normalizeClassCode(value).slice(0, 1);
    const next = [...code];
    next[index] = clean;
    setCode(next);
    setStatus("idle");
    setFoundClass(null);
    if (clean && index < 7) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 8)
      .split("");
    const next = [...code];
    pasted.forEach((ch, i) => (next[i] = ch));
    setCode(next);
    setError("");
    const lastIndex = Math.min(pasted.length, 8) - 1;
    if (lastIndex >= 0) inputsRef.current[lastIndex]?.focus();
  };

  const handleFindClass = async (e) => {
    e.preventDefault();
    if (code.some((character) => !character)) { setStatus("incomplete"); return; }
    setStatus("loading");
    setError("");
    try {
      const match = await findClassroomByCode(user?.id, formatClassCode(code));
      setFoundClass(match);
      setStatus(match ? "found" : "not-found");
    } catch (requestError) {
      setError(requestError.message || "Unable to look up this class.");
      setStatus("idle");
    }
  };

  const handleJoin = async () => {
    setError("");
    try {
      await joinClassroom(user?.id, formatClassCode(code));
      setStatus("joined");
    } catch (requestError) {
      setError(requestError.message || "Unable to join this class.");
    }
  };

  const handleReset = () => {
    setCode(Array.from({ length: CLASS_CODE_LENGTH }, () => ""));
    setStatus("idle");
    setFoundClass(null);
    setError("");
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-canvas py-6 px-4 sm:py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-6 text-center sm:mb-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-canvas sm:h-14 sm:w-14">
            <svg
              className="h-6 w-6 text-primary sm:h-7 sm:w-7"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-text-heading sm:text-3xl">
            Join a class
          </h1>
          <p className="mt-1 text-sm text-text-muted sm:text-base">
            Ask your teacher for the class code, then enter it below.
          </p>
        </div>

        <div className="rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-border sm:p-6 lg:p-8">
          {status !== "joined" && (
            <form onSubmit={handleFindClass}>
              <label className="mb-3 block text-center text-sm font-medium text-text-main">
                Class code
              </label>

              <div className="flex items-center justify-center gap-1 sm:gap-2">
                {code.map((char, i) => (
                  <div key={i} className="flex items-center">
                    <input
                      ref={(el) => (inputsRef.current[i] = el)}
                      type="text"
                      inputMode="text"
                      maxLength={1}
                      value={char}
                      onChange={(e) => handleChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onPaste={handlePaste}
                      className="h-10 w-7 rounded-md border border-border text-center text-base font-semibold uppercase text-text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-focus sm:h-12 sm:w-11 sm:rounded-lg sm:text-xl"
                    />
                    {i === 3 && (
                      <span className="mx-0.5 text-border sm:mx-1.5">–</span>
                    )}
                  </div>
                ))}
              </div>

              {status === "incomplete" && (
                <p className="mt-3 text-center text-xs text-secondary">Enter all 8 characters of the class code.</p>
              )}
              {status === "not-found" && (
                <p className="mt-3 text-center text-xs text-secondary">
                  No class found with that code. Check it and try again.
                </p>
              )}
              {error && <p className="mt-3 text-center text-xs text-secondary" role="alert">{error}</p>}

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-surface transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? "Looking up class…" : "Find class"}
              </button>

              <p className="mt-4 text-center text-xs text-text-muted">
                Try{" "}
                <button
                  type="button"
                  onClick={() => setCode(["A", "L", "G", "2", "7", "X", "9", "K"])}
                  className="font-medium text-primary hover:underline"
                >
                  ALG2-7X9K
                </button>{" "}
                as a demo code
              </p>
            </form>
          )}

          {/* Found class preview */}
          {status === "found" && foundClass && (
            <div className="mt-6 border-t border-border pt-5">
              <div
                className={`flex h-24 items-center justify-center rounded-xl ${foundClass.theme} sm:h-28`}
              >
                <span className="text-lg font-semibold text-surface/90 sm:text-xl">
                  {foundClass.title}
                </span>
              </div>
              <div className="mt-4 space-y-1 text-center">
                <p className="text-base font-medium text-text-heading">
                  {foundClass.title} · {foundClass.subtitle}
                </p>
                <p className="text-sm text-text-muted">
                  {foundClass.subject} · Taught by {foundClass.instructor?.name || foundClass.teacher?.name || 'CampusMind teacher'}
                </p>
              </div>
              <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-main transition hover:bg-canvas sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleJoin}
                  className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-surface transition hover:bg-primary-hover"
                >
                  Join this class
                </button>
              </div>
            </div>
          )}

          {/* Joined confirmation */}
          {status === "joined" && foundClass && (
            <div className="flex flex-col items-center py-4 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-canvas">
                <svg
                  className="h-6 w-6 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-text-heading">
                You've joined {foundClass.title}
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                {foundClass.subtitle} with {foundClass.instructor?.name || foundClass.teacher?.name || 'CampusMind teacher'}
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-6 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-main transition hover:bg-canvas"
              >
                Join another class
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
