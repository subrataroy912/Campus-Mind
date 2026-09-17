import { Link } from "react-router";
import { ArrowLeft, Check, Globe, Lock, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { routes } from "@/routes/paths";
import { useJoinSpaceForm } from "../hooks/useJoinSpaceForm.js";

export default function JoinSpace() {
  const {
    code,
    status,
    foundSpace,
    error,
    inputsRef,
    publicCourse,
    isOpenCourse,
    isInviteCourse,
    optionalCourseId,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleSubmit,
    handleReset,
  } = useJoinSpaceForm();

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
            {isOpenCourse ? (
              <Globe className="h-5 w-5 text-primary" />
            ) : isInviteCourse ? (
              <Lock className="h-5 w-5 text-text-muted" />
            ) : (
              <Sparkles className="h-5 w-5 text-primary" />
            )}
          </div>
          <h1 className="text-xl font-bold text-text-heading sm:text-2xl">
            {isOpenCourse
              ? publicCourse?.title || "Join open space"
              : isInviteCourse
              ? "Invite-only space"
              : "Join a space"}
          </h1>
          <p className="mt-1 text-xs text-text-muted sm:text-sm">
            {isOpenCourse
              ? "This space has open enrollment. Anyone can join — no code required."
              : isInviteCourse
              ? "This space requires an invitation from the host or facilitator to join."
              : optionalCourseId
              ? "Enter your code to join this space."
              : "Ask your instructor or space lead for the code, then enter it below."}
          </p>
        </div>

        <div className="rounded-2xl bg-surface p-4 shadow-xs ring-1 border border-border sm:p-6">
          {status !== "joined" && (
            isOpenCourse ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="rounded-xl border border-border/70 bg-canvas p-4 text-center">
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {publicCourse?.subject || "Open Space"}
                  </div>
                  <div className="mt-1 text-base font-semibold text-text-heading">
                    {publicCourse?.title || "Space"}
                  </div>
                  {publicCourse?.instructorName && (
                    <div className="mt-0.5 text-xs text-text-muted">
                      Facilitator: {publicCourse.instructorName}
                    </div>
                  )}
                </div>

                {error && (
                  <p className="text-center text-xs text-destructive font-medium" role="alert">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full text-xs font-semibold text-white bg-primary hover:bg-primary-hover shadow-xs h-9"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      <span>Joining space…</span>
                    </>
                  ) : (
                    "Join and Open Space"
                  )}
                </Button>
              </form>
            ) : isInviteCourse ? (
              <div className="text-center py-2 space-y-4">
                <div className="rounded-xl border border-border/70 bg-canvas p-4">
                  <div className="text-sm font-semibold text-text-heading">
                    {publicCourse?.title || "Space"}
                  </div>
                  <p className="mt-2 text-xs text-text-muted leading-relaxed">
                    This space is invite-only. Please contact the facilitator or lead to be added to the roster.
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  <Link to={routes.spaces.list}>
                    Back to spaces
                  </Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
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
                  <p className="mt-2 text-center text-xs text-destructive">
                    Enter all 8 characters of the space code.
                  </p>
                )}
                {error && (
                  <p
                    className="mt-2 text-center text-xs text-destructive font-medium"
                    role="alert"
                  >
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-4 h-9 w-full text-xs font-semibold text-white bg-primary hover:bg-primary-hover shadow-xs"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      <span>Joining space…</span>
                    </>
                  ) : (
                    "Join space"
                  )}
                </Button>
              </form>
            )
          )}

          {/* Joined confirmation */}
          {status === "joined" && foundSpace && (
            <div className="flex flex-col items-center py-2 text-center">
              <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <Check className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <h2 className="text-base font-bold text-text-heading">
                You've joined {foundSpace.title}
              </h2>
              <p className="mt-0.5 text-xs text-text-muted">
                {foundSpace.subtitle} with{" "}
                {foundSpace.instructor?.name ||
                  foundSpace.teacher?.name ||
                  "CampusMind facilitator"}
              </p>
              <div className="mt-4 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  size="sm"
                  className="h-9 text-xs font-semibold text-white bg-primary hover:bg-primary-hover shadow-xs"
                >
                  <Link to={routes.spaces.detail(foundSpace.id)}>
                    Open space
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="h-9 text-xs"
                >
                  Join another
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
