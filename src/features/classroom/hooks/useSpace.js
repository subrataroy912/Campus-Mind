import { useMemo, useEffect } from "react";
import { useAuth } from "@/context/AuthContext.jsx";
import {
  useFindClassroomByIdQuery,
  useFetchClassroomsQuery,
} from "../api/classroomApi.js";
import { useGetPublicCourseQuery } from "@/features/explore/api/exploreApi.js";
import { isTeacherRole, isUserEnrolled } from "../roles.js";
import { clearPersistedApiState } from "@/app/apiCachePersistence.js";
import { getCourseNotFoundDetails } from "../api/classroomErrors.js";

/**
 * Custom hook to encapsulate fetching and state resolution for a Space / Classroom.
 * Handles enrollment check, public course fallback, teacher role resolution, and not-found handling.
 *
 * @param {string} spaceId The course / space ID
 * @returns Space details, role indicators, and loading/error states.
 */
export function useSpace(spaceId) {
  const { user, authStatus } = useAuth();
  const userId = user?.id;
  const isHydrating = authStatus === "hydrating";
  const skip = isHydrating || !spaceId;

  const {
    data: detailData,
    isLoading: isDetailLoading,
    error: detailError,
    refetch,
  } = useFindClassroomByIdQuery(spaceId, { skip });

  const { data: classrooms } = useFetchClassroomsQuery(undefined, {
    skip: isHydrating,
  });

  const cachedSpace = useMemo(() => {
    return classrooms?.find(
      (c) => c.id === spaceId || c.courseId === spaceId
    );
  }, [classrooms, spaceId]);

  // If user is not an enrolled member, detail might return 404 or 403. Check public endpoint as fallback.
  const shouldFetchPublic = Boolean(
    !cachedSpace &&
      (detailError?.status === 404 ||
        detailError?.status === 403 ||
        detailError?.originalStatus === 404 ||
        detailError?.originalStatus === 403)
  );

  const { data: publicSpace, isLoading: isPublicLoading } = useGetPublicCourseQuery(spaceId, {
    skip: !shouldFetchPublic || skip,
  });

  const space = useMemo(() => {
    const fromDetail = detailData?.data ?? detailData;
    if (fromDetail) {
      return cachedSpace ? { ...cachedSpace, ...fromDetail } : fromDetail;
    }
    if (cachedSpace) return cachedSpace;
    if (publicSpace) {
      const name = publicSpace.title ?? publicSpace.name ?? "Untitled space";
      return {
        ...publicSpace,
        id: publicSpace.id ?? spaceId,
        name,
        title: name,
        className: name,
        subtitle: publicSpace.section ?? publicSpace.subtitle ?? "",
        section: publicSpace.section ?? "",
        role: "VIEWER",
        isEnrolled: false,
        theme: "bg-primary",
        logo: publicSpace.logoUrl ?? publicSpace.logo ?? null,
        logoUrl: publicSpace.logoUrl ?? publicSpace.logo ?? null,
      };
    }
    return undefined;
  }, [cachedSpace, detailData, publicSpace, spaceId]);

  const isEnrolled = useMemo(() => {
    return isUserEnrolled(space, userId);
  }, [space, userId]);

  const teacher = useMemo(() => {
    return isTeacherRole(space?.role);
  }, [space?.role]);

  const notFoundDetails = !publicSpace ? getCourseNotFoundDetails(detailError, spaceId) : null;

  useEffect(() => {
    if (!notFoundDetails || publicSpace) return;
    clearPersistedApiState();
    console.error("[Campus-Mind] Space detail request returned 404", notFoundDetails);
  }, [spaceId, detailError, notFoundDetails, publicSpace]);

  const isLoading = (isDetailLoading && !space) || (shouldFetchPublic && isPublicLoading && !space);
  const isNotFound = !isLoading && !space && Boolean(notFoundDetails || detailError?.status === 404);
  const error = publicSpace ? undefined : detailError;

  return {
    space,
    classroom: space, // backward-compatibility alias
    isEnrolled,
    teacher,
    isLoading,
    isNotFound,
    error,
    refetch,
  };
}

export const useClassroom = useSpace;
export default useSpace;
