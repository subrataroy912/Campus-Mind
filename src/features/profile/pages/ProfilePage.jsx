import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { ArrowLeft, Eye, Lock, Shield, Users, UserX } from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";
import { Button } from "@/components/ui/button.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { ContentList } from "@/components/common/ContentList.jsx";
import ClassCard from "@/features/classroom/components/ClassCard.jsx";
import {
  getSharedClassCount,
  getSharedClassIds,
} from "@/utils/sharedClasses.js";
import { formatDisplayText } from "@/utils/textFormat.js";
import { useDashboardData } from "@/features/dashboard/useDashboardData.js";
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
      { replace: true }
    );
  };
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { classrooms = [] } = useDashboardData();
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
    [viewedUser]
  );
  const sharedIds = getSharedClassIds(currentUser, viewedUser);
  const sharedClassCount = getSharedClassCount(currentUser, viewedUser);
  const classes = isOwner
    ? classrooms
    : classrooms.filter((item) => sharedIds.includes(item.id));
  const createdClasses = classes.filter(
    (item) => item.ownerId === viewedUser.id
  );
  const joinedClasses = classes.filter(
    (item) => item.ownerId !== viewedUser.id
  );
  if (
    authStatus === "hydrating" ||
    isCurrentProfileLoading ||
    isPublicProfileLoading
  )
    return <ProfilePageSkeleton />;

  if (isCurrentProfileError && isProfileOwner)
    return (
      <ProfileMessage
        icon={UserX}
        badge="Error"
        title="Unable to load profile"
        description="We could not load your profile details right now. Please try again later."
      />
    );

  if (isPublicProfileError && !isProfileOwner)
    return (
      <ProfileMessage
        icon={Lock}
        badge="Private / Unavailable"
        title="This profile is private or unavailable"
        description="This profile is private, unavailable, or you do not have permission to view it."
      />
    );

  if (!profile)
    return (
      <ProfileMessage
        icon={UserX}
        badge="Not Found"
        title="Profile unavailable"
        description="This profile could not be found or you do not have permission to view it."
      />
    );

  if (
    !isProfileOwner &&
    !profile.privacy.discoverable &&
    sharedClassCount === 0
  )
    return (
      <ProfileMessage
        icon={Lock}
        badge="Private Profile"
        title="This profile is private"
        description="This member is only visible to people in a shared class."
      />
    );
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
    } catch (err) {
      console.error("Failed to upload avatar", err);
    }
  };

  const handleBannerUpload = async (file) => {
    try {
      await updateProfile({ bannerFile: file });
    } catch (err) {
      console.error("Failed to upload banner", err);
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
      <div className="flex flex-col">
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
            iconWrapperClass="bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
            items={createdClasses}
            layout="grid"
            renderItem={(classroom) => <ClassCard classroom={classroom} />}
            className="mt-0 pt-0 sm:mt-0 sm:pt-0 border-none"
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
            iconWrapperClass="bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400"
            items={joinedClasses}
            layout="grid"
            renderItem={(classroom) => <ClassCard classroom={classroom} />}
            className={
              createdClasses.length > 0
                ? "mt-8 border-t border-border pt-6 sm:mt-8 sm:pt-6"
                : "mt-0 pt-0 sm:mt-0 sm:pt-0 border-none"
            }
          />
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto min-h-dvh max-w-6xl px-3 py-3 sm:px-6 lg:py-6">
      {/* Back button */}
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="-ml-2 gap-2 text-text-muted hover:text-text-heading"
        >
          <ArrowLeft size={16} /> Back
        </Button>
      </div>

      {preview && (
        <div className="sticky top-2 z-30 mb-4 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Eye size={18} />
            <span>You are viewing your profile as others see it.</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreview(false)}
            className="h-8 border-border bg-surface text-text-heading shadow-xs hover:bg-canvas"
          >
            Exit preview
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <ProfileHeader
          profile={profile}
          isOwner={isOwner}
          onEdit={() => setIsEditing(true)}
          onPreview={() => setPreview((p) => !p)}
          sharedClassCount={sharedClassCount}
          onAvatarUpload={handleAvatarUpload}
          onBannerUpload={handleBannerUpload}
        />

        <section>
          <ProfileDetails details={details} />
        </section>

        <section className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-border">
          <div className="flex gap-1 border-b border-border p-2" role="tablist">
            <Button
              variant={activeTab === "classes" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("classes")}
            >
              Classes
            </Button>
            {isOwner && (
              <Button
                variant={activeTab === "saved" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("saved")}
              >
                Saved
              </Button>
            )}
          </div>

          <div className="p-4 sm:p-5">{renderTabContent()}</div>
        </section>
      </div>

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
    <div className="flex min-h-dvh flex-col bg-canvas">
      {/* Top back navigation */}
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-2 text-text-muted hover:text-text-heading -ml-2"
        >
          <ArrowLeft size={16} /> Back
        </Button>
      </div>

      <div className="grid flex-1 place-items-center p-6">
        <div className="flex max-w-md flex-col items-center text-center">
          {isLoading ? (
            <div className="size-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          ) : (
            <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-surface ring-1 ring-border shadow-sm">
              <Icon className="size-8 text-primary" />
            </div>
          )}

          {badge && !isLoading && (
            <span className="mb-3 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {badge}
            </span>
          )}

          <h2 className="text-xl font-bold tracking-tight text-text-heading sm:text-2xl">
            {title}
          </h2>

          {description && (
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              {description}
            </p>
          )}

          {!isLoading && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="gap-2"
              >
                <ArrowLeft size={16} /> Go Back
              </Button>
              <Button
                onClick={() => navigate(routes.dashboard)}
                className="gap-2"
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
