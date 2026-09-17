import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router";
import { useAuth } from "@/context/AuthContext.jsx";
import { triggerLifecycleRefresh } from "@/features/events/refreshEvents.js";
import { useGetPublicCourseQuery } from "@/features/explore/api/exploreApi.js";
import { joinClassroom } from "../api/classroomService.js";
import {
  CLASS_CODE_LENGTH,
  formatClassCode,
  normalizeClassCode,
} from "@/utils/classCode.js";

function getJoinErrorMessage(error) {
  const message = error?.data?.error || error?.message;
  if (error?.status === 403)
    return "This code is invalid or expired, enrollment is disabled, or your account cannot join spaces.";
  if (error?.status === 409) return message || "You have already joined this space.";
  return message || "Unable to join this space. Please try again.";
}

/**
 * Custom hook encapsulating the state and behavior of the Join Space screen.
 * Handles the 8-character code inputs, focus management, clipboard paste, public space lookup, and join execution.
 */
export function useJoinSpaceForm() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const initialCode = normalizeClassCode(searchParams.get("code") || "");
  const optionalCourseId = searchParams.get("courseId") || "";
  const queryAccessType = (searchParams.get("accessType") || "").toUpperCase();

  const { data: publicCourse, isLoading: isPublicCourseLoading } =
    useGetPublicCourseQuery(optionalCourseId, { skip: !optionalCourseId });

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
  const [status, setStatus] = useState("idle"); // idle | loading | joined | incomplete
  const [foundSpace, setFoundSpace] = useState(null);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    const clean = normalizeClassCode(value).slice(0, 1);
    const next = [...code];
    next[index] = clean;
    setCode(next);
    setStatus("idle");
    setFoundSpace(null);
    if (clean && index < CLASS_CODE_LENGTH - 1) {
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
      .slice(0, CLASS_CODE_LENGTH)
      .split("");
    const next = [...code];
    pasted.forEach((ch, i) => (next[i] = ch));
    setCode(next);
    setError("");
    const lastIndex = Math.min(pasted.length, CLASS_CODE_LENGTH) - 1;
    if (lastIndex >= 0) inputsRef.current[lastIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const formattedCode = formatClassCode(code);
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
        isOpenCourse ? "" : formattedCode || ""
      );
      triggerLifecycleRefresh(dispatch, "course-created");
      setFoundSpace(joined);
      setStatus("joined");
    } catch (requestError) {
      setError(getJoinErrorMessage(requestError));
      setStatus("idle");
    }
  };

  const handleReset = () => {
    setCode(Array.from({ length: CLASS_CODE_LENGTH }, () => ""));
    setStatus("idle");
    setFoundSpace(null);
    setError("");
    inputsRef.current[0]?.focus();
  };

  return {
    code,
    status,
    foundSpace,
    foundClass: foundSpace, // alias
    error,
    inputsRef,
    publicCourse,
    isPublicCourseLoading,
    isOpenCourse,
    isInviteCourse,
    optionalCourseId,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleSubmit,
    handleReset,
  };
}

export default useJoinSpaceForm;
