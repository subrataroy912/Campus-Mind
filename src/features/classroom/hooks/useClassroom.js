import { useEffect, useMemo } from "react";
import {
  useFindClassroomByIdQuery,
  useFetchClassroomsQuery,
} from "../api/classroomApi.js";
import { useGetPublicCourseQuery } from "@/features/explore/api/exploreApi.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { clearPersistedApiState } from "@/app/apiCachePersistence.js";
import { getCourseNotFoundDetails } from "../api/classroomErrors.js";

export function useClassroom(classId) {
  const { user, authStatus } = useAuth();
  const userId = user?.id;
  const skip = authStatus === "hydrating" || !classId;

  const {
    data: detailData,
    error,
    isLoading: isDetailLoading,
  } = useFindClassroomByIdQuery(classId, {
    skip,
  });

  const { data: classrooms } = useFetchClassroomsQuery(undefined, {
    skip: authStatus === "hydrating",
  });

  const cachedCourse = useMemo(() => {
    return classrooms?.find(
      (c) => c.id === classId || c.courseId === classId
    );
  }, [classrooms, classId]);

  // Check public course endpoint if detailData failed with 404 or 403 (user is not an enrolled member)
  const shouldFetchPublic = Boolean(
    !cachedCourse && (error?.status === 404 || error?.status === 403 || error?.originalStatus === 404 || error?.originalStatus === 403)
  );

  const { data: publicCourse } = useGetPublicCourseQuery(classId, {
    skip: !shouldFetchPublic || skip,
  });

  const classroom = useMemo(() => {
    if (cachedCourse) return cachedCourse;
    const fromDetail = detailData?.data ?? detailData;
    if (fromDetail) return fromDetail;
    if (publicCourse) {
      const name =
        publicCourse.title ?? publicCourse.name ?? "Untitled class";
      return {
        ...publicCourse,
        id: publicCourse.id ?? classId,
        name,
        title: name,
        className: name,
        subtitle: publicCourse.section ?? publicCourse.subtitle ?? "",
        section: publicCourse.section ?? "",
        role: "VIEWER",
        isEnrolled: false,
        theme: "bg-primary",
      };
    }
    return undefined;
  }, [cachedCourse, detailData, publicCourse, classId]);

  const isEnrolled = useMemo(() => {
    // 1. If course is found in user's enrolled classrooms list
    if (cachedCourse) return true;
    if (classrooms?.some((c) => c.id === classId || c.courseId === classId)) {
      return true;
    }

    // 2. If current user is the owner or teacher of this course
    if (
      userId &&
      (classroom?.ownerId === userId || classroom?.teacherId === userId)
    ) {
      return true;
    }

    // 3. If course explicitly states enrollment status
    if (classroom?.isEnrolled === true || classroom?.enrolled === true) {
      return true;
    }
    if (
      classroom?.isEnrolled === false ||
      classroom?.enrolled === false ||
      classroom?.role === "VIEWER"
    ) {
      return false;
    }

    return Boolean(classroom && classroom.role && classroom.role !== "VIEWER");
  }, [cachedCourse, classrooms, userId, classroom, classId]);

  const notFoundDetails = !publicCourse ? getCourseNotFoundDetails(error, classId) : null;

  useEffect(() => {
    if (!notFoundDetails || publicCourse) return;
    clearPersistedApiState();
    console.error("[Campus-Mind] Course detail request returned 404", notFoundDetails);
  }, [classId, error, notFoundDetails, publicCourse]);

  return {
    classroom,
    isEnrolled,
    error: publicCourse ? undefined : error,
    isLoading: isDetailLoading && !classroom,
    notFound: Boolean(notFoundDetails && !publicCourse),
  };
}
