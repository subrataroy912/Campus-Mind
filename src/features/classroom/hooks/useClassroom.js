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
  const { authStatus } = useAuth();
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

  // If detailData 404s or is not loaded yet, and not in cachedCourse, check public course endpoint
  const shouldFetchPublic = Boolean(
    !cachedCourse && (error?.status === 404 || (!detailData && classId))
  );

  const { data: publicCourse } = useGetPublicCourseQuery(classId, {
    skip: !shouldFetchPublic || skip,
  });

  const classroom = useMemo(() => {
    const fromDetail = detailData?.data ?? detailData;
    if (fromDetail) return fromDetail;
    if (cachedCourse) return cachedCourse;
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
  }, [detailData, cachedCourse, publicCourse, classId]);

  const isEnrolled = useMemo(() => {
    if (cachedCourse) return true;
    if (classroom?.isEnrolled === false || classroom?.role === "VIEWER") {
      return false;
    }
    if (classrooms) {
      return classrooms.some(
        (c) => c.id === classId || c.courseId === classId
      );
    }
    return Boolean(classroom && classroom.role !== "VIEWER");
  }, [cachedCourse, classroom, classrooms, classId]);

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
