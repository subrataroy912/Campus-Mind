import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Eye } from "lucide-react";
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
import { EditProfileModal } from "../components/EditProfileModal.jsx";

const profileFor = (user) => ({
  ...user,
  name:
    user?.displayName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "CampusMind member",
  bio: user?.about || user?.bio,
  avatar: user?.avatarUrl || user?.avatar_url || user?.avatar,
  banner: user?.bannerUrl || user?.banner_url,
  batchYear: user?.gradeLevel || user?.batchYear,
  firstName: user?.firstName,
  lastName: user?.lastName,
  links: Array.isArray(user?.links) ? user.links : [],
  privacy: {
    discoverable: user?.profileVisibility !== "PRIVATE",
    ...user?.privacy,
  },
});

export default function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, updateProfile, authStatus } = useAuth();
  const [activeTab, setActiveTab] = useState("classes");
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

  if (isCurrentProfileLoading || isPublicProfileLoading)
    return (
      <ProfileMessage
        title="Loading profile"
        description="Fetching the latest profile information."
      />
    );
  if (
    !profile ||
    (isPublicProfileError && !isProfileOwner) ||
    (isCurrentProfileError && isProfileOwner)
  )
    return (
      <ProfileMessage
        title="Profile unavailable"
        description="This profile is unavailable or you do not have permission to view it."
      />
    );
  if (!isProfileOwner && !profile.privacy.discoverable && sharedClassCount === 0)
    return (
      <ProfileMessage
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
      label: "Account type",
      value: formatDisplayText(profile.accountType) || "—",
      icon: "member",
    },
    {
      label: "Academic level",
      value: formatDisplayText(profile.batchYear) || "—",
      icon: "program",
    },
    {
      label: "Location",
      value: [profile.city, profile.country].filter(Boolean).join(", ") || "—",
      icon: "focus",
    },
    {
      label: "Profile visibility",
      value: formatDisplayText(profile.profileVisibility || "PUBLIC"),
      icon: "member",
    },
  ];
  const save = async (formData) => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="mx-auto min-h-dvh max-w-6xl px-3 py-3 sm:px-6 lg:py-6">
      {/* Back button */}
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-2 text-text-muted hover:text-text-heading -ml-2"
        >
          <ArrowLeft size={16} /> Back
        </Button>
      </div>

      {preview && (
        <div className="sticky top-2 z-30 mb-4 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-2">
            <Eye size={18} />
            <span>You are viewing your profile as others see it.</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreview(false)}
            className="h-8 bg-surface text-text-heading border-border shadow-xs hover:bg-canvas"
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
        />
        <section className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-border sm:p-6">
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
          <div className="p-4 sm:p-5">
            {activeTab === "saved" ? (
              <EmptyState
                title="No saved items yet"
                description="Save posts and resources to find them quickly later."
                action={{ to: "/dashboard/saved", label: "Browse saved items" }}
              />
            ) : classes.length ? (
              <ContentList
                layout="grid"
                items={classes}
                renderItem={(classroom) => <ClassCard classroom={classroom} />}
              />
            ) : (
              <EmptyState
                title={
                  isOwner
                    ? "You haven't joined a class yet"
                    : "No shared classes yet"
                }
                description={
                  isOwner
                    ? "Join a class to see it on your profile."
                    : "You don't have any classes in common right now."
                }
                action={
                  isOwner
                    ? { to: "/dashboard/class/join", label: "Join a class" }
                    : undefined
                }
              />
            )}
          </div>
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
function ProfileMessage({ title, description }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-canvas p-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-text-heading">{title}</h1>
        <p className="mt-2 text-sm text-text-muted">{description}</p>
        <Button to="/dashboard" variant="outline" className="mt-5">
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}
