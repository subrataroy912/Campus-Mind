import { NavLink } from "react-router";
import { store } from "@/app/store.js";
import { classroomApi } from "@/features/spaces/api/classroomApi.js";
import { exploreApi } from "@/features/explore/api/exploreApi.js";
import { messagesApi } from "@/features/messages/api/messagesApi.js";
import { profileApi } from "@/features/profile/api/profileApi.js";
import { routes } from "@/routes/paths.js";

function prefetchRouteData(to) {
  if (!to || !store?.dispatch) return;
  if (to === routes.home || to === routes.spaces.list) {
    store.dispatch(
      classroomApi.util.prefetch("fetchClassrooms", undefined, {
        ifOlderThan: 120,
      }),
    );
  }
  if (to === routes.home || to === routes.explore) {
    store.dispatch(
      exploreApi.util.prefetch(
        "getExploreFeed",
        { page: 0, size: 20 },
        { ifOlderThan: 120 },
      ),
    );
  }
  if (to === routes.messages) {
    store.dispatch(
      messagesApi.util.prefetch("getSpaceChatRooms", undefined, {
        ifOlderThan: 60,
      }),
    );
  }
  if (to === routes.profile.me) {
    store.dispatch(
      profileApi.util.prefetch("getCurrentProfile", undefined, {
        ifOlderThan: 120,
      }),
    );
  }
}

export function SidebarLink({
  to,
  label,
  Icon,
  compact = false,
  onNavigate,
  end,
}) {
  const isEnd = end ?? true;

  return (
    <NavLink
      to={to}
      end={isEnd}
      prefetch="intent"
      onMouseEnter={() => prefetchRouteData(to)}
      onFocus={() => prefetchRouteData(to)}
      className={(navState) => {
        const isActive = typeof navState === "object" ? navState?.isActive : false;
        return `group relative flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
          compact ? "justify-center px-0" : ""
        } ${
          isActive
            ? "bg-primary/10 text-primary font-semibold"
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        }`.trim();
      }}
      onClick={onNavigate}
      title={compact ? label : undefined}
    >
      {Icon && (
        <Icon
          size={15}
          className="shrink-0 transition-colors"
        />
      )}
      <span className={compact ? "hidden" : "truncate"}>{label}</span>
    </NavLink>
  );
}
