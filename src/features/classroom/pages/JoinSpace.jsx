import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link, useSearchParams } from "react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  Globe,
  Link2,
  Lock,
  UserPlus,
  Users,
} from "lucide-react";
import { joinClassroom } from "../api/classroomService.js";
import { useValidateInviteTokenQuery } from "../api/classroomApi.js";
import { Button } from "@/components/ui/button.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { triggerLifecycleRefresh } from "@/app/refreshEvents.js";
import { useGetPublicCourseQuery } from "@/features/explore/api/exploreApi.js";
import { routes } from "@/routes/paths";
import {
  CLASS_CODE_LENGTH,
  formatClassCode,
  normalizeClassCode,
} from "@/utils/classCode.js";
import { parseApiError } from "@/lib/errorUtils.js";

function formatExpiryHours(expiresAt) {
  if (!expiresAt) return "Expires in 48 hours";
  try {
    const target = new Date(expiresAt).getTime();
    const diffMs = target - Date.now();
    if (diffMs <= 0) return "Expired";
    const hours = Math.ceil(diffMs / (1000 * 60 * 60));
    if (hours < 24) return `Expires in ${hours} hour${hours === 1 ? "" : "s"}`;
    const days = Math.ceil(hours / 24);
    return `Expires in ${days} day${days === 1 ? "" : "s"}`;
  } catch {
    return "Expires in 48 hours";
  }
}

export default function JoinSpace() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const initialCode = normalizeClassCode(searchParams.get("code") || "");
  const optionalCourseId = searchParams.get("courseId") || "";
  const queryAccessType = (searchParams.get("accessType") || "").toUpperCase();
  const inviteToken = searchParams.get("invite") || "";

  const {
    data: inviteData,
    isLoading: isValidatingInvite,
    error: inviteValidateError,
  } = useValidateInviteTokenQuery(inviteToken, {
    skip: !inviteToken,
  });

  const isInviteInvalid = Boolean(
    inviteToken && (inviteValidateError || inviteData?.expired)
  );

  const { data: publicCourse } = useGetPublicCourseQuery(
    optionalCourseId,
    { skip: !optionalCourseId || Boolean(inviteToken) }
  );

  const effectiveAccessType =
    queryAccessType ||
    publicCourse?.accessType ||
    (publicCourse?.visibility === "PUBLIC" ? "OPEN" : "CODE");

  const isOpenCourse = Boolean(
    optionalCourseId &&
      (effectiveAccessType === "OPEN" || publicCourse?.visibility === "PUBLIC")
  );
  const isInviteCourse = Boolean(
    optionalCourseId && effectiveAccessType === "INVITE"
  );

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

  const handleJoinInvite = async () => {
    if (!inviteData?.courseId || !inviteToken) return;
    setStatus("loading");
    setError("");
    try {
      const joined = await joinClassroom(
        user?.id,
        inviteData.courseId,
        inviteToken
      );
      triggerLifecycleRefresh(dispatch, "course-created");
      setFoundClass(
        joined || {
          id: inviteData.courseId,
          title: inviteData.title,
          subtitle: inviteData.section,
          owner: { name: inviteData.ownerName },
        }
      );
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
    <div className="min-h-screen bg-canvas py-4 px-3 sm:py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        {/* Back Link */}
        <div className="mb-3">
          <Link
            to={routes.spaces.list}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-heading transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to spaces</span>
          </Link>
        </div>
        {/* Header */}
        <div className="mb-4 text-center sm:mb-5">
          <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-11 sm:w-11">
            {inviteToken ? (
              <Link2 className="h-5 w-5 text-primary" />
            ) : isOpenCourse ? (
              <Globe className="h-5 w-5 text-primary" />
            ) : isInviteCourse ? (
              <Lock className="h-5 w-5 text-text-muted" />
            ) : (
              <UserPlus className="h-5 w-5 text-primary" />
            )}
          </div>
          <h1 className="text-xl font-bold text-text-heading sm:text-2xl">
            {inviteToken
              ? "Space Invitation"
              : isOpenCourse
              ? publicCourse?.title || "Join open space"
              : isInviteCourse
              ? "Invite-only space"
              : "Join a space"}
          </h1>
          <p className="mt-1 text-xs text-text-muted sm:text-sm">
            {inviteToken
              ? "You have been invited to join this space via a private link."
              : isOpenCourse
              ? "This space has open enrollment. Anyone can join — no code required."
              : isInviteCourse
              ? "This space requires an invitation from the space owner or admin to join."
              : optionalCourseId
              ? "Enter your code to join this space."
              : "Ask the space owner or admin for the code, then enter it below."}
          </p>
        </div>

        <div className="rounded-2xl bg-surface p-4 shadow-xs ring-1 ring-border sm:p-6">
          {status !== "joined" && (
            inviteToken ? (
              isValidatingInvite ? (
                <div className="py-8 text-center text-xs text-text-muted">
                  Verifying invitation link…
                </div>
              ) : isInviteInvalid ? (
                <div className="py-4 text-center space-y-3">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <h2 className="text-base font-bold text-text-heading">
                    Invitation Expired or Invalid
                  </h2>
                  <p className="text-xs text-text-muted max-w-sm mx-auto">
                    This invitation link has expired (links are valid for 48 hours) or has been revoked. Please ask the space owner or admin for a new link.
                  </p>
                  <Link
                    to={routes.spaces.list}
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold text-white transition hover:bg-primary-hover shadow-xs"
                  >
                    Back to spaces
                  </Link>
                </div>
              ) : (
                /* Valid Invite Preview Card */
                <div className="space-y-4">
                  {inviteData?.coverUrl && (
                    <div className="h-28 w-full overflow-hidden rounded-xl bg-muted/40">
                      <img
                        src={inviteData.coverUrl}
                        alt={inviteData.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    {inviteData?.logoUrl ? (
                      <img
                        src={inviteData.logoUrl}
                        alt={inviteData.title}
                        className="h-12 w-12 rounded-xl object-cover border border-border shrink-0"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary shrink-0">
                        {inviteData?.title?.slice(0, 2)?.toUpperCase() || "SP"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <h2 className="text-base font-bold text-text-heading truncate">
                        {inviteData?.title}
                      </h2>
                      <p className="text-xs text-text-muted truncate">
                        {inviteData?.subject ? `${inviteData.subject} • ` : ""}
                        by {inviteData?.ownerName || "Space Owner"}
                      </p>
                    </div>
                  </div>

                  {inviteData?.description && (
                    <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">
                      {inviteData.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted/50 px-2 py-0.5 text-xs text-text-muted border border-border/60">
                      <Users className="h-3 w-3 text-primary" />
                      <span>{inviteData?.memberCount ?? 0} members</span>
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-300 border border-amber-500/20">
                      <Clock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                      <span>{formatExpiryHours(inviteData?.expiresAt)}</span>
                    </span>
                  </div>

                  {error && (
                    <p className="text-center text-xs text-secondary" role="alert">
                      {error}
                    </p>
                  )}

                  <Button
                    onClick={handleJoinInvite}
                    disabled={status === "loading"}
                    className="w-full h-10 text-xs font-semibold gap-1.5"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>{status === "loading" ? "Joining space…" : "Join Space"}</span>
                  </Button>
                </div>
              )
            ) : isOpenCourse ? (
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
                      Created by: {publicCourse.instructorName}
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
                    This space is invite-only. Please contact the space owner or admin to be added.
                  </p>
                </div>
                <Link
                  to={routes.dashboard}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-main transition hover:bg-canvas"
                >
                  Back to dashboard
                </Link>
              </div>
            ) : (
              <form onSubmit={handleFindClass}>
                <label className="mb-2.5 block text-center text-xs font-medium text-text-main">
                  Space code
                </label>

                <div className="flex items-center justify-center gap-1 sm:gap-1.5">
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
                        className="h-10 w-8 rounded-lg border border-border text-center text-base font-semibold uppercase text-text-heading outline-none transition focus:border-primary focus:ring-1 focus:ring-focus sm:h-11 sm:w-10 sm:text-lg"
                      />
                      {i === 3 && (
                        <span className="mx-0.5 text-border sm:mx-1 font-bold">–</span>
                      )}
                    </div>
                  ))}
                </div>

                {status === "incomplete" && (
                  <p className="mt-2 text-center text-xs text-secondary">
                    Enter all 8 characters of the space code.
                  </p>
                )}
                {status === "not-found" && (
                  <p className="mt-2 text-center text-xs text-secondary">
                    No space found with that code. Check it and try again.
                  </p>
                )}
                {error && (
                  <p
                    className="mt-2 text-center text-xs text-secondary"
                    role="alert"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-4 h-9 w-full rounded-lg bg-primary px-4 text-xs font-semibold text-surface transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer shadow-xs"
                >
                  {status === "loading" ? "Joining space…" : "Join space"}
                </button>
              </form>
            )
          )}

          {/* Joined confirmation */}
          {status === "joined" && foundClass && (
            <div className="flex flex-col items-center py-2 text-center">
              <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <svg
                  className="h-5 w-5"
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
              <h2 className="text-base font-bold text-text-heading">
                You've joined {foundClass.title}
              </h2>
              <p className="mt-0.5 text-xs text-text-muted">
                {foundClass.subtitle ? `${foundClass.subtitle} • ` : ""}created by{" "}
                {foundClass.owner?.name ||
                  foundClass.ownerName ||
                  "Space Owner"}
              </p>
              <div className="mt-4 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
                <Link
                  to={routes.spaces.detail(foundClass.id)}
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-medium text-white transition hover:bg-primary-hover shadow-xs"
                >
                  Open space
                </Link>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-border px-4 text-xs font-medium text-text-main transition hover:bg-canvas"
                >
                  Join another
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
  if (error?.status === 403) {
    return (
      error?.data?.message ||
      error?.data?.error ||
      "This code is invalid or expired, enrollment is disabled, or your account cannot join courses."
    );
  }
  if (error?.status === 409) {
    return (
      error?.data?.message ||
      error?.data?.error ||
      "You have already joined this space."
    );
  }
  return parseApiError(error, "Unable to join this space. Please try again.").message;
}
