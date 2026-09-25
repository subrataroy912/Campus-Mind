import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowLeft, Globe, Link2, Lock, UserPlus } from "lucide-react";
import { joinClassroom } from "../api/classroomService.js";
import { useValidateInviteTokenQuery } from "../api/classroomApi.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { useGetPublicCourseQuery } from "@/features/explore/api/exploreApi.js";
import { routes } from "@/routes/paths";
import {
  CLASS_CODE_LENGTH,
  formatClassCode,
  normalizeClassCode,
} from "@/utils/classCode.js";
import { parseApiError } from "@/lib/errorUtils.js";
import { toast } from "@/components/ui/toast.jsx";
import { SectionLoader } from "@/components/common/LoadingState.jsx";
import {
  InvalidInviteScreen,
  InviteOnlyMessage,
  InvitePreviewCard,
  JoinSuccessScreen,
  ManualCodeForm,
  OpenCourseForm,
} from "../components/join/index.js";

function getJoinErrorMessage(error) {
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
  return parseApiError(error, "Unable to join this space. Please try again.")
    .message;
}

export default function JoinSpace() {
  const [searchParams] = useSearchParams();
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

  const { data: publicCourse } = useGetPublicCourseQuery(optionalCourseId, {
    skip: !optionalCourseId || Boolean(inviteToken),
  });

  const isInviteInvalid = Boolean(
    inviteToken && (inviteValidateError || inviteData?.expired),
  );

  const effectiveAccessType =
    queryAccessType ||
    publicCourse?.accessType ||
    (publicCourse?.visibility === "PUBLIC" ? "OPEN" : "CODE");
  const isOpenCourse = Boolean(
    optionalCourseId &&
    (effectiveAccessType === "OPEN" || publicCourse?.visibility === "PUBLIC"),
  );
  const isInviteCourse = Boolean(
    optionalCourseId && effectiveAccessType === "INVITE",
  );

  const [code, setCode] = useState(() =>
    Array.from(
      { length: CLASS_CODE_LENGTH },
      (_, index) => initialCode[index] || "",
    ),
  );
  const [status, setStatus] = useState("idle");
  const [foundClass, setFoundClass] = useState(null);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (status === "incomplete") {
      setStatus("idle");
    }
  };

  const handleJoinWithCode = async (e) => {
    if (e) e.preventDefault();
    const classCode = formatClassCode(code);
    const hasCode = code.every(Boolean);

    if (!isOpenCourse && !hasCode && !optionalCourseId) {
      setStatus("incomplete");
      return;
    }

    setStatus("loading");
    try {
      const joined = await joinClassroom(
        user?.id,
        optionalCourseId || undefined,
        isOpenCourse ? "" : classCode || "",
      );
      setFoundClass(joined);
      setStatus("joined");
      toast.add({
        title: "Joined space",
        description: `You are now a member of ${joined?.title || "this space"}.`,
        type: "success",
      });
    } catch (requestError) {
      setStatus("idle");
      toast.add({
        title: "Join failed",
        description: getJoinErrorMessage(requestError),
        type: "error",
      });
    }
  };

  const handleJoinOpenCourse = async (e) => {
    if (e) e.preventDefault();
    setStatus("loading");
    try {
      const joined = await joinClassroom(user?.id, optionalCourseId, "");
      setFoundClass(joined);
      setStatus("joined");
      toast.add({
        title: "Joined space",
        description: `You are now a member of ${joined?.title || "this space"}.`,
        type: "success",
      });
    } catch (requestError) {
      setStatus("idle");
      toast.add({
        title: "Join failed",
        description: getJoinErrorMessage(requestError),
        type: "error",
      });
    }
  };

  const handleJoinInvite = async () => {
    if (!inviteData?.courseId || !inviteToken) return;
    setStatus("loading");
    try {
      const joined = await joinClassroom(
        user?.id,
        inviteData.courseId,
        inviteToken,
      );
      setFoundClass(
        joined || {
          id: inviteData.courseId,
          title: inviteData.title,
          subtitle: inviteData.section,
          owner: { name: inviteData.ownerName },
        },
      );
      setStatus("joined");
      toast.add({
        title: "Joined space",
        description: `You have successfully joined ${inviteData.title}.`,
        type: "success",
      });
    } catch (requestError) {
      setStatus("idle");
      toast.add({
        title: "Join failed",
        description: getJoinErrorMessage(requestError),
        type: "error",
      });
    }
  };

  const handleReset = () => {
    setCode(Array.from({ length: CLASS_CODE_LENGTH }, () => ""));
    setStatus("idle");
    setFoundClass(null);
  };

  // Header Title & Icon
  const headerIcon = inviteToken ? (
    <Link2 className="h-5 w-5 text-primary" />
  ) : isOpenCourse ? (
    <Globe className="h-5 w-5 text-primary" />
  ) : isInviteCourse ? (
    <Lock className="h-5 w-5 text-text-muted" />
  ) : (
    <UserPlus className="h-5 w-5 text-primary" />
  );

  const headerTitle = inviteToken
    ? "Space Invitation"
    : isOpenCourse
      ? publicCourse?.title || "Join open space"
      : isInviteCourse
        ? "Invite-only space"
        : "Join a space";

  const headerSubtitle = inviteToken
    ? "You have been invited to join this space via a private link."
    : isOpenCourse
      ? "This space has open enrollment. Anyone can join — no code required."
      : isInviteCourse
        ? "This space requires an invitation from the space owner or admin to join."
        : optionalCourseId
          ? "Enter your code to join this space."
          : "Ask the space owner or admin for the code, then enter it below.";

  return (
    <div className="w-full bg-canvas py-4 px-3 sm:py-6 sm:px-6 lg:px-8 min-w-0">
      <div className="mx-auto max-w-md">
        {/* Back Link */}
        <div className="mb-3">
          <Link
            to={routes.spaces.list}
            className="inline-flex min-h-9 items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-heading transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to spaces</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-4 text-center sm:mb-5">
          <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-11 sm:w-11">
            {headerIcon}
          </div>
          <h1 className="text-xl font-bold text-text-heading sm:text-2xl">
            {headerTitle}
          </h1>
          <p className="mt-1 text-xs text-text-muted sm:text-sm">
            {headerSubtitle}
          </p>
        </div>

        {/* Content Card */}
        <div className="rounded-2xl bg-surface p-4 shadow-xs ring-1 ring-border sm:p-6">
          {status === "joined" && foundClass ? (
            <JoinSuccessScreen joinedClass={foundClass} onReset={handleReset} />
          ) : inviteToken ? (
            isValidatingInvite ? (
              <SectionLoader label="Verifying invitation link…" />
            ) : isInviteInvalid ? (
              <InvalidInviteScreen />
            ) : (
              <InvitePreviewCard
                inviteData={inviteData}
                onJoin={handleJoinInvite}
                isLoading={status === "loading"}
              />
            )
          ) : isOpenCourse ? (
            <OpenCourseForm
              course={publicCourse}
              onSubmit={handleJoinOpenCourse}
              isLoading={status === "loading"}
            />
          ) : isInviteCourse ? (
            <InviteOnlyMessage course={publicCourse} />
          ) : (
            <ManualCodeForm
              code={code}
              onChange={handleCodeChange}
              onSubmit={handleJoinWithCode}
              isLoading={status === "loading"}
              status={status}
            />
          )}
        </div>
      </div>
    </div>
  );
}
