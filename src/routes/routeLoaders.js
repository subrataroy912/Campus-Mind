import { classroomApi } from "@/features/classroom/api/classroomApi.js";
import { exploreApi } from "@/features/explore/api/exploreApi.js";
import { profileApi } from "@/features/profile/api/profileApi.js";
import { courseworkApi } from "@/features/classroom/api/courseworkApi.js";

/** /dashboard — no dynamic params; never needs a loader re-run after mutations. */
export const dashboardShouldRevalidate = () => false;

/** /spaces — no dynamic params; skip unless forced by a param change (none here). */
export const spacesShouldRevalidate = () => false;

/**
 * /spaces/:classId — only re-run when navigating to a *different* space.
 * Same-space tab switches or mutations don't need the loader to re-fire.
 */
export const spaceDetailShouldRevalidate = ({ currentParams, nextParams }) =>
  currentParams.classId !== nextParams.classId;

/** /explore — no dynamic params; tab changes are query-param driven and RTK handles them. */
export const exploreShouldRevalidate = () => false;

export const createDashboardLoader = (store) => () => {
  if (!store) return null;
  const state = store.getState();
  const token = state?.auth?.accessToken;

  // Warm user profile and classrooms if authenticated
  if (token) {
    store.dispatch(
      classroomApi.util.prefetch("fetchClassrooms", undefined, {
        force: false,
      }),
    );
    store.dispatch(
      profileApi.util.prefetch("getCurrentProfile", undefined, {
        force: false,
      }),
    );
  }

  // Public explore suggestions for the dashboard
  store.dispatch(
    exploreApi.util.prefetch(
      "getExploreFeed",
      { page: 0, size: 20 },
      {
        force: false,
      },
    ),
  );

  return null;
};

export const createSpacesLoader = (store) => () => {
  if (!store) return null;
  const state = store.getState();
  const token = state?.auth?.accessToken;

  if (token) {
    store.dispatch(
      classroomApi.util.prefetch("fetchClassrooms", undefined, {
        force: false,
      }),
    );
  }

  return null;
};

export const createSpaceDetailLoader =
  (store) =>
  ({ params }) => {
    if (!store || !params?.classId) return null;
    const classId = params.classId;

    store.dispatch(
      classroomApi.util.prefetch("findClassroomById", classId, {
        force: false,
      }),
    );

    const state = store.getState();
    if (state?.auth?.accessToken) {
      store.dispatch(
        courseworkApi.util.prefetch(
          "getCourseworkList",
          { courseId: classId, page: 0, size: 20 },
          { force: false },
        ),
      );
    }

    return null;
  };

export const createExploreLoader =
  (store) =>
  ({ request }) => {
    if (!store) return null;

    try {
      const url = new URL(request.url);
      const tab = url.searchParams.get("tab");
      if (tab === "people") {
        store.dispatch(
          exploreApi.util.prefetch("getExplorePeople", undefined, {
            force: false,
          }),
        );
        store.dispatch(
          exploreApi.util.prefetch(
            "getExplorePeopleRecommendations",
            undefined,
            { force: false },
          ),
        );
      } else {
        store.dispatch(
          exploreApi.util.prefetch(
            "getExploreFeed",
            { subject: undefined, page: 0, size: 20 },
            { force: false },
          ),
        );
      }
    } catch {
      store.dispatch(
        exploreApi.util.prefetch(
          "getExploreFeed",
          { page: 0, size: 20 },
          { force: false },
        ),
      );
    }

    return null;
  };
