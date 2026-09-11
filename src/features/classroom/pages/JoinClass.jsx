import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link, useSearchParams } from "react-router";
import { ArrowLeft, Globe, Lock } from "lucide-react";
import { joinClassroom } from "../api/classroomService";
import { useAuth } from "@/context/AuthContext.jsx";
import { triggerLifecycleRefresh } from "@/features/events/refreshEvents.js";
import { useGetPublicCourseQuery } from "@/features/explore/api/exploreApi.js";
import {
  CLASS_CODE_LENGTH,
  formatClassCode,
  normalizeClassCode,
} from "@/utils/classCode.js";

export default function JoinClass() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const initialCode = normalizeClassCode(searchParams.get("code") || "");
  const optionalCourseId = searchParams.get("courseId") || "";
  const queryAccessType = (searchParams.get("accessType") || "").toUpperCase();

  const { data: publicCourse } = useGetPublicCourseQuery(
    optionalCourseId,
    { skip: !optionalCourseId }
  );

  const effectiveAccessType =
    queryAccessType ||
    publicCourse?.accessType ||
    (publicCourse?.visibility === "PUBLIC" ? "OPEN" : "CODE");

  const isOpenCourse = Boolean(optionalCourseId && effectiveAccessType === "OPEN");
  const isInviteCourse = Boolean(optionalCourseId && effectiveAccessType === "INVITE");

  const [code, setCode] = useState(() =>
    Array.from(
      { length: CLASS_CODE_LENGTH },
      (_, index) => initialCode[index] || ""
    )
  );
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
    const classCode = formatClassCode(code);
    const hasCode = code.every(Boolean);

    if (!isOpenCourse && !hasCode && !optionalCourseId) {
      setStatus("incomplete");
      return;
    }

    setStatus("loading");
    setError("");
    try {
      const joined = await joinClassroom(
        user?.id,
        optionalCourseId || undefined,
        isOpenCourse ? "" : classCode || ""
      );
      triggerLifecycleRefresh(dispatch, "course-created");
      setFoundClass(joined);
      setStatus("joined");
    } catch (requestError) {
      setError(joinErrorMessage(requestError));
      setStatus("idle");
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
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-heading transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to classes</span>
          </Link>
        </div>
        {/* Header */}
        <div className="mb-6 text-center sm:mb-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-canvas sm:h-14 sm:w-14">
            {isOpenCourse ? (
              <Globe className="h-6 w-6 text-primary sm:h-7 sm:w-7" />
            ) : isInviteCourse ? (
              <Lock className="h-6 w-6 text-text-muted sm:h-7 sm:w-7" />
            ) : (
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
            )}
          </div>
          <h1 className="text-2xl font-semibold text-text-heading sm:text-3xl">
            {isOpenCourse
              ? publicCourse?.title || "Join open class"
              : isInviteCourse
              ? "Invite-only class"
              : "Join a class"}
          </h1>
          <p className="mt-1 text-sm text-text-muted sm:text-base">
            {isOpenCourse
              ? "This class has open enrollment. Anyone can join — no class code required."
              : isInviteCourse
              ? "This class requires an invitation from the instructor to join."
              : optionalCourseId
              ? "Enter your class code to join this classroom."
              : "Ask your teacher for the class code, then enter it below."}
          </p>
        </div>

        <div className="rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-border sm:p-6 lg:p-8">
          {status !== "joined" && (
            isOpenCourse ? (
              <form onSubmit={handleFindClass}>
                <div className="rounded-xl border border-border/70 bg-canvas p-4 text-center">
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {publicCourse?.subject || "Open Course"}
                  </div>
                  <div className="mt-1 text-base font-medium text-text-heading">
                    {publicCourse?.title || "Classroom"}
                  </div>
                  {publicCourse?.instructorName && (
                    <div className="mt-0.5 text-xs text-text-muted">
                      Instructor: {publicCourse.instructorName}
                    </div>
                  )}
                </div>

                {error && (
                  <p className="mt-3 text-center text-xs text-secondary" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-surface transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "loading" ? "Joining class…" : "Join and Open Class"}
                </button>
              </form>
            ) : isInviteCourse ? (
              <div className="text-center py-2">
                <div className="rounded-xl border border-border/70 bg-canvas p-4">
                  <div className="text-sm font-medium text-text-heading">
                    {publicCourse?.title || "Classroom"}
                  </div>
                  <p className="mt-2 text-xs text-text-muted">
                    This classroom is invite-only. Please contact the teacher to be added to the student roster.
                  </p>
                </div>
                <Link
                  to="/dashboard"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-main transition hover:bg-canvas"
                >
                  Back to dashboard
                </Link>
              </div>
            ) : (
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
                  <p className="mt-3 text-center text-xs text-secondary">
                    Enter all 8 characters of the class code.
                  </p>
                )}
                {status === "not-found" && (
                  <p className="mt-3 text-center text-xs text-secondary">
                    No class found with that code. Check it and try again.
                  </p>
                )}
                {error && (
                  <p
                    className="mt-3 text-center text-xs text-secondary"
                    role="alert"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-surface transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "loading" ? "Joining class…" : "Join class"}
                </button>
              </form>
            )
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
                {foundClass.subtitle} with{" "}
                {foundClass.instructor?.name ||
                  foundClass.teacher?.name ||
                  "CampusMind teacher"}
              </p>
              <div className="mt-6 flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
                <Link
                  to={`/dashboard/classes/${foundClass.id}`}
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
                >
                  Open class
                </Link>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-main transition hover:bg-canvas"
                >
                  Join another class
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function joinErrorMessage(error) {
  const message = error?.data?.error || error?.message;
  if (error?.status === 403)
    return "This code is invalid or expired, enrollment is disabled, or your account cannot join courses.";
  if (error?.status === 409) return message || "You have already joined this class.";
  return message || "Unable to join this class. Please try again.";
}
