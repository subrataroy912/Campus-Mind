import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { ArrowLeft, Eye, Lock, Shield, Users, UserX } from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";
import { Button } from "@/components/ui/button.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import ClassCard from "@/features/classroom/components/ClassCard.jsx";
import {
  getSharedClassCount,
  getSharedClassIds,
} from "@/utils/sharedClasses.js";
import { formatDisplayText } from "@/utils/textFormat.js";
import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData.js";
import {
  useGetCurrentProfileQuery,
  useGetPublicProfileQuery,
} from "../api/profileApi.js";
import ProfileHeader from "../components/ProfileHeader.jsx";
import ProfileDetails from "../components/ProfileDetails.jsx";
import ProfilePageSkeleton from "../components/ProfilePageSkeleton.jsx";
import { EditProfileModal } from "../components/EditProfileModal.jsx";
import { routes } from "@/routes/paths.js";
import { DashboardSection } from "@/features/dashboard/components/DashboardSection.jsx";
import { toast } from "@/components/ui/toast.jsx";
import { parseApiError } from "@/lib/errorUtils.js";

const profileFor = (user) => ({
  ...user,
  name:
    user?.displayName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "CampusMind member",
  bio: user?.about || user?.bio,
  avatar: user?.avatarUrl || user?.avatar_url || user?.avatar,
  banner: user?.bannerUrl || user?.banner_url,
  firstName: user?.firstName,
  lastName: user?.lastName,
  phone: user?.phone,
  gender: user?.gender,
  dateOfBirth: user?.dateOfBirth,
  address: user?.address,
  city: user?.city,
  country: user?.country,
  headline: user?.headline,
  links: Array.isArray(user?.links) ? user.links : [],
  canCreateCourses: Boolean(user?.canCreateCourses),
  profileVisibility: user?.profileVisibility || "PUBLIC",
  privacy: {
    discoverable: user?.profileVisibility !== "PRIVATE",
    ...user?.privacy,
  },
});

export default function ProfilePage() {
  const { userId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user: currentUser, updateProfile, authStatus } = useAuth();

  const activeTab = searchParams.get("tab") || "classes";
  const setActiveTab = (tab) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (tab === "classes") {
          next.delete("tab");
        } else {
          next.set("tab", tab);
        }
        return next;
      },
      { replace: true },
    );
  };

  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { classrooms = [] } = useDashboardData({ includeExplore: false });

  const isProfileOwner = !userId || userId === currentUser?.id;
  const isOwner = isProfileOwner && !preview;

  const {
    data: currentProfile,
    isLoading: isCurrentProfileLoading,
    isError: isCurrentProfileError,
  } = useGetCurrentProfileQuery(undefined, {
    skip: authStatus === "hydrating" || !isProfileOwner,
  });

  const {
    data: publicProfile,
    isLoading: isPublicProfileLoading,
    isError: isPublicProfileError,
  } = useGetPublicProfileQuery(userId, {
    skip: authStatus === "hydrating" || !userId || isProfileOwner,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  const viewedUser = isProfileOwner
    ? currentProfile || currentUser
    : publicProfile;

  const profile = useMemo(
    () => viewedUser && profileFor(viewedUser),
    [viewedUser],
  );

  const sharedIds = getSharedClassIds(currentUser, viewedUser);
  const sharedClassCount = getSharedClassCount(currentUser, viewedUser);

  const classes = isOwner
    ? classrooms
    : classrooms.filter((item) => sharedIds.includes(item.id));

  const createdClasses = classes.filter(
    (item) => item.ownerId === viewedUser?.id,
  );
  const joinedClasses = classes.filter(
    (item) => item.ownerId !== viewedUser?.id,
  );

  if (
    authStatus === "hydrating" ||
    isCurrentProfileLoading ||
    isPublicProfileLoading
  ) {
    return <ProfilePageSkeleton />;
  }

  if (isCurrentProfileError && isProfileOwner) {
    return (
      <ProfileMessage
        icon={UserX}
        badge="Error"
        title="Unable to load profile"
        description="We could not load your profile details right now. Please try again later."
      />
    );
  }

  if (isPublicProfileError && !isProfileOwner) {
    return (
      <ProfileMessage
        icon={Lock}
        badge="Private / Unavailable"
        title="This profile is private or unavailable"
        description="This profile is private, unavailable, or you do not have permission to view it."
      />
    );
  }

  if (!profile) {
    return (
      <ProfileMessage
        icon={UserX}
        badge="Not Found"
        title="Profile unavailable"
        description="This profile could not be found or you do not have permission to view it."
      />
    );
  }

  if (
    !isProfileOwner &&
    !profile.privacy.discoverable &&
    sharedClassCount === 0
  ) {
    return (
      <ProfileMessage
        icon={Lock}
        badge="Private Profile"
        title="This profile is private"
        description="This member is only visible to people in a shared class."
      />
    );
  }

  const details = [
    {
      label: "Headline",
      value: profile.headline || "CampusMind learner",
      icon: "program",
    },
    {
      label: "Location",
      value: [profile.city, profile.country].filter(Boolean).join(", ") || "—",
      icon: "location",
    },
    {
      label: "Profile visibility",
      value: formatDisplayText(profile.profileVisibility || "PUBLIC"),
      icon: "visibility",
    },
    ...(profile.phone
      ? [{ label: "Phone", value: profile.phone, icon: "phone" }]
      : []),
    ...(profile.gender
      ? [
          {
            label: "Gender",
            value: formatDisplayText(profile.gender),
            icon: "gender",
          },
        ]
      : []),
    ...(profile.dateOfBirth
      ? [
          {
            label: "Date of Birth",
            value: profile.dateOfBirth,
            icon: "calendar",
          },
        ]
      : []),
    ...(profile.address
      ? [{ label: "Address", value: profile.address, icon: "address" }]
      : []),
  ];

  const handleAvatarUpload = async (file) => {
    try {
      await updateProfile({ avatarFile: file });
      toast.add({
        title: "Avatar updated",
        description: "Your profile picture has been updated.",
        type: "success",
      });
    } catch (err) {
      toast.add({
        title: "Avatar upload failed",
        description: parseApiError(err, "Unable to upload avatar picture.").message,
        type: "error",
      });
    }
  };

  const handleBannerUpload = async (file) => {
    try {
      await updateProfile({ bannerFile: file });
      toast.add({
        title: "Banner updated",
        description: "Your profile header banner has been updated.",
        type: "success",
      });
    } catch (err) {
      toast.add({
        title: "Banner upload failed",
        description: parseApiError(err, "Unable to upload banner image.").message,
        type: "error",
      });
    }
  };

  const save = async (formData) => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const renderTabContent = () => {
    if (activeTab === "saved") {
      return (
        <EmptyState
          title="No saved items yet"
          description="Save posts and resources to find them quickly later."
          action={{ to: routes.saved, label: "Browse saved items" }}
        />
      );
    }

    if (!classes.length) {
      return (
        <EmptyState
          title={
            isOwner
              ? "You haven't joined or created a class yet"
              : "No shared classes yet"
          }
          description={
            isOwner
              ? "Join or create a class to see it on your profile."
              : "You don't have any classes in common right now."
          }
          action={
            isOwner
              ? { to: routes.explore, label: "Explore classes" }
              : undefined
          }
        />
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {createdClasses.length > 0 && (
          <DashboardSection
            id="managed-spaces-heading"
            title={isOwner ? "Spaces you manage" : "Spaces they manage"}
            description={
              isOwner
                ? "Spaces where you are an admin or teacher."
                : "Spaces managed by this user."
            }
            icon={Shield}
            iconWrapperClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
            items={createdClasses}
            layout="grid"
            renderItem={(classroom) => <ClassCard classroom={classroom} />}
          />
        )}

        {joinedClasses.length > 0 && (
          <DashboardSection
            id="joined-spaces-heading"
            title={isOwner ? "Spaces you've joined" : "Shared spaces"}
            description={
              isOwner
                ? "Communities you are actively participating in."
                : "Communities you both belong to."
            }
            icon={Users}
            iconWrapperClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            items={joinedClasses}
            layout="grid"
            renderItem={(classroom) => <ClassCard classroom={classroom} />}
            className={
              createdClasses.length > 0 ? "border-t border-border/60 pt-4" : ""
            }
          />
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-3 px-3 py-1 sm:gap-4 sm:px-6">
      {/* Back Button & Preview Bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="-ml-2 h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Button>

        {preview && (
          <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary shadow-xs">
            <Eye className="h-3.5 w-3.5" />
            <span>Public preview mode</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreview(false)}
              className="h-6 border-border bg-background px-2 text-[11px] text-foreground hover:bg-muted"
            >
              Exit
            </Button>
          </div>
        )}
      </div>

      {/* Main Stack */}
      <ProfileHeader
        profile={profile}
        isOwner={isOwner}
        onEdit={() => setIsEditing(true)}
        onPreview={() => setPreview((p) => !p)}
        sharedClassCount={sharedClassCount}
        onAvatarUpload={handleAvatarUpload}
        onBannerUpload={handleBannerUpload}
      />

      <ProfileDetails details={details} />

      {/* Compact Tab Surface */}
      <section className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-3 sm:p-4">
        {/* Segmented Pill Switcher */}
        <div className="inline-flex h-8 w-fit items-center rounded-lg bg-muted p-1 text-muted-foreground">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "classes"}
            onClick={() => setActiveTab("classes")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-xs font-medium transition-all ${
              activeTab === "classes"
                ? "bg-background text-foreground shadow-xs"
                : "hover:text-foreground"
            }`}
          >
            Classes
          </button>
          {isOwner && (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "saved"}
              onClick={() => setActiveTab("saved")}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-xs font-medium transition-all ${
                activeTab === "saved"
                  ? "bg-background text-foreground shadow-xs"
                  : "hover:text-foreground"
              }`}
            >
              Saved
            </button>
          )}
        </div>

        <div>{renderTabContent()}</div>
      </section>

      {isOwner && (
        <EditProfileModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          profile={profile}
          onSave={save}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}

function ProfileMessage({
  icon: Icon = Lock,
  badge = "Private Profile",
  title = "This profile is private",
  description = "This member is only visible to people in a shared class.",
  isLoading = false,
}) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="-ml-2 h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Button>
      </div>

      <div className="grid flex-1 place-items-center p-6">
        <div className="flex max-w-sm flex-col items-center text-center">
          {isLoading ? (
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          ) : (
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card shadow-xs">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          )}

          {badge && !isLoading && (
            <span className="mb-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
              {badge}
            </span>
          )}

          <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-xs leading-normal text-muted-foreground">
              {description}
            </p>
          )}

          {!isLoading && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="h-8 px-3 text-xs"
              >
                Go Back
              </Button>
              <Button
                size="sm"
                onClick={() => navigate(routes.dashboard)}
                className="h-8 px-3 text-xs"
              >
                Back to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
