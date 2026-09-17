import { useState } from "react";
import { useNavigate } from "react-router";
import {
  useArchiveClassroomMutation,
  useDeleteClassroomMutation,
  useLeaveClassroomMutation,
} from "../api/classroomApi.js";
import { routes } from "@/routes/paths.js";

/**
 * Custom hook to handle space administrative and membership actions
 * (archive, delete, leave) along with dialog states.
 *
 * @param {Object} space The space / classroom object
 */
export function useSpaceActions(space) {
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  const [archiveClassroom, { isLoading: isArchiving }] =
    useArchiveClassroomMutation();
  const [deleteClassroom, { isLoading: isDeleting }] =
    useDeleteClassroomMutation();
  const [leaveClassroom, { isLoading: isLeaving }] =
    useLeaveClassroomMutation();

  const handleArchive = async () => {
    if (!space?.id) return;
    try {
      await archiveClassroom(space.id).unwrap();
      setIsArchiveDialogOpen(false);
      navigate(routes.spaces.list);
    } catch (err) {
      console.error("Failed to archive space", err);
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!space?.id) return;
    try {
      await deleteClassroom(space.id).unwrap();
      setIsDeleteDialogOpen(false);
      navigate(routes.spaces.list);
    } catch (err) {
      console.error("Failed to delete space", err);
      throw err;
    }
  };

  const handleLeave = async () => {
    if (!space?.id) return;
    try {
      await leaveClassroom(space.id).unwrap();
      setIsLeaveDialogOpen(false);
      navigate(routes.spaces.list);
    } catch (err) {
      console.error("Failed to leave space", err);
      throw err;
    }
  };

  return {
    // Dialog open states
    isEditModalOpen,
    setIsEditModalOpen,
    isArchiveDialogOpen,
    setIsArchiveDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isLeaveDialogOpen,
    setIsLeaveDialogOpen,

    // Loading states
    isArchiving,
    isDeleting,
    isLeaving,

    // Action handlers
    handleArchive,
    handleDelete,
    handleLeave,
  };
}

export default useSpaceActions;
