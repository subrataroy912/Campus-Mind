import { useEffect, useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { fetchClassrooms } from "../../features/classroom/api/classroomService.js";
import { Button } from "../../components/ui/button.jsx";
import { Card } from "../../components/ui/card.jsx";
import ClassCard from "../../components/dashboard/ClassCard.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import EditProfileForm from "./components/EditProfileForm.jsx";
import ProfileDetails from "./components/ProfileDetails.jsx";
import ProfileHeader from "./components/ProfileHeader.jsx";
import ProfileSection from "./components/ProfileSection.jsx";

const DEFAULT_STUDENT_PROFILE = {
  headline: "Learning with the CampusMind community.",
  bio: "I enjoy sharing notes, asking thoughtful questions, and making steady progress with my classmates.",
  program: "Campus learner",
};

const DEFAULT_TEACHER_PROFILE = {
  headline: "Creating a welcoming space for learning together.",
  bio: "I use CampusMind to share resources, support questions, and help every learner feel included.",
  program: "Campus educator",
};

function getProfile(user) {
  const defaults =
    user?.role === "teacher"
      ? DEFAULT_TEACHER_PROFILE
      : DEFAULT_STUDENT_PROFILE;
  return {
    name: user?.name || "CampusMind member",
    role: user?.role || "student",
    avatar: user?.avatar,
    ...defaults,
    ...user,
  };
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [classrooms, setClassrooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const profile = useMemo(() => getProfile(user), [user]);

  useEffect(() => {
    let isCurrent = true;
    fetchClassrooms()
      .then((items) => {
        if (isCurrent) setClassrooms(items);
      })
      .catch(() => {
        if (isCurrent) setLoadError(true);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, []);

  const unreadClassCount = classrooms.filter(
    (classroom) => (classroom.unreadCount ?? classroom.unreadMessages ?? 0) > 0,
  ).length;
  const memberSince = user?.created_at
    ? new Intl.DateTimeFormat(undefined, {
        month: "short",
        year: "numeric",
      }).format(new Date(user.created_at))
    : "recently";
  const details = [
    {
      label: profile.role === "teacher" ? "Teaching area" : "Program",
      value: profile.program,
      icon: "program",
    },
    { label: "Community focus", value: profile.headline, icon: "focus" },
    { label: "Member since", value: memberSince, icon: "member" },
  ];

  const saveProfile = (nextProfile) => {
    updateProfile({
      name: nextProfile.name.trim(),
      headline: nextProfile.headline.trim(),
      bio: nextProfile.bio.trim(),
      program: nextProfile.program.trim(),
    });
    setIsEditing(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-1 py-1 sm:px-2 lg:py-2">
      <div className="space-y-6">
        <ProfileHeader profile={profile} onEdit={() => setIsEditing(true)} />
        {isEditing && (
          <EditProfileForm
            profile={profile}
            onCancel={() => setIsEditing(false)}
            onSave={saveProfile}
          />
        )}

        {/* Main Responsive Grid Container */}
        <div className="grid gap-6 items-start lg:grid-cols-[minmax(0,1fr)_19rem]">
          {/* Main Content Column */}
          <div className="space-y-6">
            {/* About Section Card */}
            <Card className="p-5 sm:p-7">
              <ProfileSection
                title="About"
                description="A few details that help the learning community get to know you."
              >
                <ProfileDetails details={details} />
              </ProfileSection>
            </Card>
          </div>

          {/* Sidebar Summary Column */}
          <aside className="space-y-4" aria-label="Profile community summary">
            <Card className="p-5">
              <p className="text-sm font-semibold text-text-heading">
                Community at a glance
              </p>
              <dl className="mt-4 divide-y divide-border">
                <div className="flex items-center justify-between py-3 first:pt-0">
                  <dt className="text-sm text-text-muted">Active classes</dt>
                  <div className="text-lg font-bold text-text-heading">
                    {isLoading ? "—" : classrooms.length}
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 last:pb-0">
                  <dt className="text-sm text-text-muted">
                    Classes with updates
                  </dt>
                  <div className="text-lg font-bold text-text-heading">
                    {isLoading ? "—" : unreadClassCount}
                  </div>
                </div>
              </dl>
            </Card>

            <Card className="p-5">
              <Users className="text-primary" size={20} aria-hidden="true" />
              <h2 className="mt-3 font-bold text-text-heading">
                Learn together
              </h2>
              <p className="mt-1 text-sm leading-6 text-text-muted">
                Your profile helps classmates and teachers recognize the person
                behind each contribution.
              </p>
              <Button
                to="/dashboard/class/join"
                variant="outline"
                className="mt-4 w-full"
              >
                <Plus size={16} aria-hidden="true" />
                Join a class
              </Button>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
