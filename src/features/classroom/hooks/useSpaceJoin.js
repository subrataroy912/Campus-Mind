import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useJoinClassroomMutation } from "../api/classroomApi.js";
import { triggerLifecycleRefresh } from "@/features/events/refreshEvents.js";

/**
 * Custom hook managing space join workflows, code verification dialogs, and error presentation.
 * Decouples modal state and API mutation logic from UI components.
 *
 * @param {Object} options
 * @param {Object} [options.space] The space/classroom object
 * @param {string} [options.spaceId] The space ID (if space object not provided)
 * @param {Function} [options.onSuccess] Optional callback executed upon successful join
 */
export function useSpaceJoin({ space, spaceId: explicitSpaceId, onSuccess } = {}) {
  const dispatch = useDispatch();
  const targetId = space?.id ?? explicitSpaceId;

  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [classCodeInput, setClassCodeInput] = useState("");
  const [localJoinError, setLocalJoinError] = useState("");

  const [joinClassroomMutation, { isLoading: isJoining, error: joinErrorObj }] =
    useJoinClassroomMutation();

  const rawAccessType = (
    space?.accessType ||
    (space?.visibility === "PUBLIC" ? "OPEN" : "CODE")
  ).toUpperCase();
  const isCodeProtected =
    rawAccessType === "CODE" && space?.visibility !== "PUBLIC";

  const handleJoin = useCallback(
    async (overrideCode) => {
      if (!targetId) return;

      const effectiveCode =
        typeof overrideCode === "string"
          ? overrideCode.trim()
          : classCodeInput.trim();

      // Prompt for code if code-protected and no code has been supplied yet
      if (isCodeProtected && !effectiveCode) {
        setLocalJoinError("");
        setIsCodeModalOpen(true);
        return;
      }

      setLocalJoinError("");
      try {
        const result = await joinClassroomMutation({
          courseId: targetId,
          code: effectiveCode || undefined,
        }).unwrap();

        triggerLifecycleRefresh(dispatch, "course-created");
        setIsCodeModalOpen(false);
        setClassCodeInput("");
        onSuccess?.(result);
        return result;
      } catch (err) {
        const message =
          err?.data?.error ||
          err?.data?.message ||
          err?.message ||
          "Failed to join space. Please verify the code and try again.";
        setLocalJoinError(message);
        throw err;
      }
    },
    [targetId, isCodeProtected, classCodeInput, joinClassroomMutation, dispatch, onSuccess]
  );

  const handleCodeSubmit = useCallback(
    (e) => {
      if (e) e.preventDefault();
      if (!classCodeInput.trim()) {
        setLocalJoinError("Please enter a space code.");
        return;
      }
      return handleJoin(classCodeInput);
    },
    [classCodeInput, handleJoin]
  );

  const joinError =
    localJoinError ||
    joinErrorObj?.data?.message ||
    joinErrorObj?.data?.error ||
    joinErrorObj?.message ||
    null;

  return {
    isCodeModalOpen,
    setIsCodeModalOpen,
    classCodeInput,
    setClassCodeInput,
    joinError,
    isJoining,
    handleJoin,
    handleCodeSubmit,
    isCodeProtected,
  };
}

export default useSpaceJoin;
