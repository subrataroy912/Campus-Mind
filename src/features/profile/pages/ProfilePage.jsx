import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "@/context/AuthContext.jsx";
import { Button } from "@/components/ui/button.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { ContentList } from "@/components/common/ContentList.jsx";
import ClassCard from "@/features/classroom/components/ClassCard.jsx";
import { mockClassrooms } from "@/mock/mockClassrooms.js";
import { lookupUserById } from "@/mock/mockUsers.js";
import { getSharedClassCount, getSharedClassIds } from "@/utils/sharedClasses.js";
import ProfileHeader from "../components/ProfileHeader.jsx";
import ProfileDetails from "../components/ProfileDetails.jsx";
import { EditProfileModal } from "../components/EditProfileModal.jsx";

const classIds = (user) => [...(user?.created_class_ids || []), ...(user?.joined_class_ids || [])];
const profileFor = (user) => ({ ...user, name: user?.name || "CampusMind member", role: user?.role || "student", privacy: { discoverable: true, ...user?.privacy } });

export default function ProfilePage() {
  const { userId } = useParams();
  const { user: currentUser, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("classes");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const isOwner = (!userId || userId === currentUser?.id) && !preview;
  const viewedUser = userId && userId !== currentUser?.id ? lookupUserById(userId) : currentUser;
  const profile = useMemo(() => viewedUser && profileFor(viewedUser), [viewedUser]);
  const currentClassIds = classIds(currentUser);
  const sharedIds = getSharedClassIds(currentUser, viewedUser);
  const sharedClassCount = getSharedClassCount(currentUser, viewedUser);
  const classes = isOwner ? mockClassrooms.filter((item) => currentClassIds.includes(item.id)) : mockClassrooms.filter((item) => sharedIds.includes(item.id));

  if (!profile) return <ProfileMessage title="This CampusMind member couldn't be found" description="The profile may have been removed or the link is incorrect." />;
  if (!isOwner && !profile.privacy.discoverable && sharedClassCount === 0) return <ProfileMessage title="This profile is private" description="This member is only visible to people in a shared class." />;
  const details = [{ label: "Department", value: profile.department || "CampusMind learner", icon: "program" }, { label: "Batch year", value: profile.batchYear || "—", icon: "focus" }, { label: "Member since", value: profile.created_at ? new Date(profile.created_at).getFullYear() : "—", icon: "member" }];
  const save = async (formData) => { setIsSaving(true); try { await updateProfile(formData); } finally { setIsSaving(false); } };
  return <div className="mx-auto min-h-dvh max-w-6xl px-3 py-3 sm:px-6 lg:py-6"><div className="space-y-4"><ProfileHeader profile={profile} isOwner={isOwner} onEdit={() => setIsEditing(true)} onPreview={() => setPreview(true)} sharedClassCount={sharedClassCount} /><section className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-border sm:p-6"><ProfileDetails details={details} /></section><section className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-border"><div className="flex gap-1 border-b border-border p-2" role="tablist"><Button variant={activeTab === "classes" ? "default" : "ghost"} size="sm" onClick={() => setActiveTab("classes")}>Classes</Button>{isOwner && <Button variant={activeTab === "saved" ? "default" : "ghost"} size="sm" onClick={() => setActiveTab("saved")}>Saved</Button>}</div><div className="p-4 sm:p-5">{activeTab === "saved" ? <EmptyState title="No saved items yet" description="Save posts and resources to find them quickly later." action={{ to: "/dashboard/saved", label: "Browse saved items" }} /> : classes.length ? <ContentList layout="grid" items={classes} renderItem={(classroom) => <ClassCard classroom={classroom} />} /> : <EmptyState title={isOwner ? "You haven't joined a class yet" : "No shared classes yet"} description={isOwner ? "Join a class to see it on your profile." : "You don't have any classes in common right now."} action={isOwner ? { to: "/dashboard/class/join", label: "Join a class" } : undefined} />}</div></section></div>{isOwner && <EditProfileModal isOpen={isEditing} onClose={() => setIsEditing(false)} profile={profile} onSave={save} isSaving={isSaving} />}</div>;
}
function ProfileMessage({ title, description }) { return <div className="grid min-h-dvh place-items-center bg-canvas p-4"><div className="max-w-md text-center"><h1 className="text-2xl font-bold text-text-heading">{title}</h1><p className="mt-2 text-sm text-text-muted">{description}</p><Button to="/dashboard" variant="outline" className="mt-5">Back to dashboard</Button></div></div>; }
