import { useState } from "react";
import {
  ExternalLink,
  Plus,
  Trash2,
  Copy,
  Check,
  Globe,
  FileText,
  GitBranch,
  MessageSquare,
  Video,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { useUpdateClassroomMutation } from "../api/classroomApi.js";
import { toast } from "@/components/ui/toast.jsx";
import { parseApiError } from "@/lib/errorUtils.js";
import { useCourseIsStaff } from "../hooks/useCourseContext.js";

const LINK_CATEGORIES = [
  { value: "DOCUMENT", label: "Document / Notes", icon: FileText },
  { value: "REPOSITORY", label: "Code / Repository", icon: GitBranch },
  { value: "COMMUNICATION", label: "Chat / Discord / Slack", icon: MessageSquare },
  { value: "MEETING", label: "Meeting / Call", icon: Video },
  { value: "OTHER", label: "Website / Other", icon: Globe },
];

function getCategoryIcon(category, url = "") {
  const lowerUrl = (url || "").toLowerCase();
  if (lowerUrl.includes("github.com") || lowerUrl.includes("gitlab.com")) {
    return GitBranch;
  }
  if (lowerUrl.includes("discord") || lowerUrl.includes("slack.com")) {
    return MessageSquare;
  }
  if (lowerUrl.includes("meet.google") || lowerUrl.includes("zoom.us")) {
    return Video;
  }
  if (lowerUrl.includes("drive.google") || lowerUrl.includes("docs.google") || lowerUrl.includes("notion.so")) {
    return FileText;
  }
  const match = LINK_CATEGORIES.find((c) => c.value === category);
  return match?.icon || Globe;
}

function getHostName(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function SpaceQuickLinks({
  classroom,
  isStaff: propIsStaff,
  isEnrolled: propIsEnrolled = true,
}) {
  const contextIsStaff = useCourseIsStaff();
  const isStaff = propIsStaff !== undefined ? propIsStaff : (contextIsStaff ?? false);
  const accessType = (classroom?.accessType || "PUBLIC").toUpperCase();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("DOCUMENT");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const [updateClassroom, { isLoading: isSaving }] = useUpdateClassroomMutation();

  const links = Array.isArray(classroom?.links) ? classroom.links : [];

  if (!propIsEnrolled && accessType === "PRIVATE") {
    return (
      <div className="mt-3 rounded-xl border border-dashed border-border/80 bg-card/60 p-6 text-center shadow-2xs">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2.5">
          <Bookmark className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">
          Resources are reserved for enrolled members
        </h3>
        <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground leading-normal">
          Request to join this private space to access shared documents, repositories, and communication channels.
        </p>
      </div>
    );
  }

  const handleCopy = (id, linkUrl) => {
    navigator.clipboard?.writeText(linkUrl).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      setErrorMsg("Title and URL are required");
      return;
    }

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const newLink = {
      id: crypto.randomUUID ? crypto.randomUUID() : `link-${Date.now()}`,
      title: title.trim(),
      url: formattedUrl,
      category,
      description: description.trim() || undefined,
    };

    const effectiveCourseId =
      classroom?.id || classroom?.courseId || classroom?._id;
    if (!effectiveCourseId) return;

    try {
      await updateClassroom({
        courseId: effectiveCourseId,
        changes: {
          links: [...links, newLink],
        },
      }).unwrap();
      setIsAddOpen(false);
      setTitle("");
      setUrl("");
      setDescription("");
      setCategory("DOCUMENT");
      setErrorMsg("");
    } catch (err) {
      setErrorMsg(parseApiError(err, "Failed to add link").message);
    }
  };

  const handleDelete = async (linkId) => {
    const effectiveCourseId =
      classroom?.id || classroom?.courseId || classroom?._id;
    if (!effectiveCourseId) return;

    const nextLinks = links.filter((l) => l.id !== linkId);
    try {
      await updateClassroom({
        courseId: effectiveCourseId,
        changes: {
          links: nextLinks,
        },
      }).unwrap();
      toast.add({
        title: "Resource removed",
        description: "The link has been removed from this space.",
        type: "success",
      });
    } catch (err) {
      toast.add({
        title: "Failed to delete link",
        description: parseApiError(err, "Could not remove this resource.").message,
        type: "error",
      });
    }
  };

  return (
    <section className="mt-3 sm:mt-4 space-y-3">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 rounded-xl bg-surface p-3 sm:p-4 shadow-xs ring-1 ring-border">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-text-heading">
            Space Resources & Quick Links
          </h2>
          <p className="text-xs text-text-muted">
            Essential repositories, documents, communication channels, and links for this space.
          </p>
        </div>
        {isStaff && (
          <Button
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="h-8 gap-1.5 text-xs font-semibold shrink-0"
          >
            <Plus size={14} />
            <span>Add Resource</span>
          </Button>
        )}
      </div>

      {/* Links Grid */}
      {links.length === 0 ? (
        <EmptyState
          title="No resources added yet"
          description={
            isStaff
              ? "Add syllabus documents, repos, video meeting rooms, or chat channels for members."
              : "Resources and important links shared for this space will appear here."
          }
          action={
            isStaff
              ? {
                  onClick: () => setIsAddOpen(true),
                  label: "Add first resource",
                }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => {
            const Icon = getCategoryIcon(link.category, link.url);
            const host = getHostName(link.url);
            const isCopied = copiedId === link.id;

            return (
              <div
                key={link.id || link.url}
                className="group relative flex flex-col justify-between rounded-xl border border-border bg-surface p-3 shadow-xs transition hover:border-primary/40 hover:shadow-sm"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary shrink-0">
                        <Icon size={14} />
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="truncate text-xs font-bold text-text-heading hover:text-primary hover:underline transition-colors"
                        title={link.title}
                      >
                        {link.title}
                      </a>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => handleCopy(link.id, link.url)}
                        title="Copy link"
                        className="grid h-6 w-6 place-items-center rounded-md text-text-muted hover:bg-canvas hover:text-text-main transition-colors cursor-pointer"
                      >
                        {isCopied ? (
                          <Check size={12} className="text-success" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        title="Open in new tab"
                        className="grid h-6 w-6 place-items-center rounded-md text-text-muted hover:bg-canvas hover:text-text-main transition-colors"
                      >
                        <ExternalLink size={12} />
                      </a>
                      {isStaff && (
                        <button
                          type="button"
                          onClick={() => handleDelete(link.id)}
                          title="Remove resource"
                          className="grid h-6 w-6 place-items-center rounded-md text-text-muted hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>

                  {link.description && (
                    <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
                      {link.description}
                    </p>
                  )}
                </div>

                <div className="mt-2.5 flex items-center justify-between border-t border-border/50 pt-2 text-[10px] text-text-muted">
                  <span className="truncate max-w-[150px] font-mono text-text-muted/80">{host}</span>
                  <span className="capitalize text-primary/90 font-medium">
                    {link.category?.toLowerCase() || "link"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Resource Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md p-4">
          <DialogHeader className="pb-2 border-b border-border">
            <DialogTitle className="text-base font-bold text-text-heading">
              Add Space Resource
            </DialogTitle>
            <DialogDescription className="text-xs text-text-muted">
              Share a document, code repository, or communication channel with all space members.
            </DialogDescription>
          </DialogHeader>

          {errorMsg && (
            <div className="rounded-lg bg-destructive/10 p-2 text-xs font-medium text-destructive">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleAddSubmit} className="space-y-3 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-heading">
                Resource Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. GitHub Repository, Course Syllabus, Zoom Room"
                className="w-full rounded-lg border border-border bg-canvas px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-hidden"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-heading">
                URL <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-border bg-canvas px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-hidden font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-heading">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-border bg-canvas px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-hidden"
              >
                {LINK_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-heading">Description (optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief note or instructions for members..."
                className="w-full rounded-lg border border-border bg-canvas px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddOpen(false)}
                disabled={isSaving}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSaving}
                className="h-8 text-xs font-semibold"
              >
                {isSaving ? "Adding•" : "Add Resource"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
