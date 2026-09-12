import { Fragment, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router";
import {
  ClipboardList,
  FileText,
  FlaskConical,
  Globe,
  MessageCircle,
  MoreVertical,
  Paperclip,
  Plus,
  Search,
  Ticket,
  Upload,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment.jsx";
import ClassHeader from "../components/ClassHeader.jsx";
import ClassTabs from "../components/ClassTabs.jsx";
import ClassQuickLinks from "../components/ClassQuickLinks.jsx";
import { ClassroomAvatar } from "../components/ClassroomAvatar.jsx";
import { useClassroom } from "../hooks/useClassroom.js";
import { joinClassroom } from "../api/classroomService.js";
import { triggerLifecycleRefresh } from "@/features/events/refreshEvents.js";
import {
  useGetCourseworkByIdQuery,
  useGetCourseworkListQuery,
  useGetSubmissionListQuery,
  useGetStudentGradebookQuery,
  useGetTeacherGradebookQuery,
  useGetCourseAnalyticsSummaryQuery,
  useGradeSubmissionMutation,
  useStartSubmissionMutation,
} from "../api/courseworkApi.js";
import {
  useCompleteUploadMutation,
  useRequestUploadUrlMutation,
} from "../api/attachmentApi.js";
import { buildUploadRequestBody } from "../api/attachmentService.js";
import {
  useAddCourseworkCommentMutation,
  useAddSubmissionCommentMutation,
  useGetCourseworkCommentsQuery,
} from "../api/commentApi.js";
import { useGetClassroomRosterQuery } from "../api/classroomApi.js";
import { isTeacherRole } from "../roles.js";

const statusClass = {
  assigned: "bg-canvas text-text-main",
  "due-soon": "bg-primary/10 text-primary",
  missing: "bg-destructive/10 text-destructive",
  done: "bg-success/10 text-success",
};
const statusLabel = {
  assigned: "Assigned",
  "due-soon": "Due soon",
  missing: "Missing",
  done: "Done",
};
const typeIcon = {
  assignment: ClipboardList,
  quiz: FlaskConical,
  material: FileText,
};
function Chip({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${statusClass[status]}`}
    >
      {statusLabel[status]}
    </span>
  );
}
function Home({ isEnrolled = true, onJoin, isJoining = false, classroom }) {
  const accessType = (
    classroom?.accessType ||
    (classroom?.visibility === "PUBLIC" ? "open" : "code")
  ).toLowerCase();

  return (
    <div className="mt-4 space-y-4">
      {!isEnrolled && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-text-main">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <Globe className="h-3.5 w-3.5" />
                Course Preview
              </div>
              <h3 className="text-base font-semibold text-text-heading">
                You are previewing this course
              </h3>
              <p className="text-sm text-text-muted">
                Join now to participate in discussions, access class materials, submit coursework, and connect with members.
              </p>
            </div>
            {accessType === "invite" ? (
              <span className="shrink-0 text-xs font-medium text-text-muted">
                Invite only
              </span>
            ) : accessType === "code" && classroom?.visibility !== "PUBLIC" ? (
              <Button
                to={`/dashboard/class/join?courseId=${encodeURIComponent(classroom?.id || "")}&accessType=code`}
                className="shrink-0 gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Join with Code
              </Button>
            ) : onJoin ? (
              <Button onClick={onJoin} loading={isJoining} className="shrink-0 gap-2">
                <UserPlus className="h-4 w-4" />
                Join Class
              </Button>
            ) : null}
          </div>
        </div>
      )}
      <EmptyState
        title="No class updates yet"
        description="Announcements and discussions will appear here when your class creates them."
      />
    </div>
  );
}
function UpcomingPanel({ items }) {
  return (
    <aside className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-border">
      <h2 className="mb-3 text-sm font-semibold text-text-heading">
        Upcoming in this class
      </h2>
      <ul className="space-y-3">
        {items
          .filter((x) => x.group !== "Past")
          .map((x) => (
            <li key={x.id}>
              <p className="text-sm text-text-main">{x.title}</p>
              <p className="mt-0.5 text-xs text-text-muted">{x.dueDate}</p>
            </li>
          ))}
      </ul>
    </aside>
  );
}
function Classwork({
  teacher,
  classId,
  isEnrolled = true,
  onJoin,
  isJoining = false,
}) {
  const { authStatus } = useAuth();
  const isHydrating = authStatus === "hydrating";
  const [expanded, setExpanded] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [draftSubmission, setDraftSubmission] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [feedbackDrafts, setFeedbackDrafts] = useState({});
  const [uploadedAttachmentsByItem, setUploadedAttachmentsByItem] = useState(
    {}
  );
  const [gradeDrafts, setGradeDrafts] = useState({});
  const [commentsByItem, setCommentsByItem] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [gradingError, setGradingError] = useState("");
  const [commentError, setCommentError] = useState("");
  const fileInputRefs = useRef({});
  const {
    data: courseworkPage,
    isLoading,
    error,
  } = useGetCourseworkListQuery(
    { courseId: classId, page: 0, size: 20 },
    {
      skip: isHydrating || !classId || !isEnrolled,
    }
  );
  const { data: expandedCoursework } = useGetCourseworkByIdQuery(
    { courseId: classId, courseworkId: expanded },
    { skip: isHydrating || !classId || !expanded }
  );
  const [startSubmission] = useStartSubmissionMutation();
  const [requestUploadUrl] = useRequestUploadUrlMutation();
  const [completeUpload] = useCompleteUploadMutation();
  const [gradeSubmission] = useGradeSubmissionMutation();
  const [addCourseworkComment] = useAddCourseworkCommentMutation();
  const [addSubmissionComment] = useAddSubmissionCommentMutation();
  const coursework = useMemo(
    () => courseworkPage?.content ?? [],
    [courseworkPage]
  );
  const { data: submissionPage } = useGetSubmissionListQuery(
    { courseworkId: expanded, page: 0, size: 20 },
    { skip: isHydrating || !classId || !expanded || !teacher }
  );
  const submissionList = submissionPage?.content ?? [];
  const { data: courseworkComments = [] } = useGetCourseworkCommentsQuery(
    { courseId: classId, courseworkId: expanded },
    { skip: isHydrating || !classId || !expanded }
  );

  const items = useMemo(() => {
    const nextItems = coursework;
    return nextItems.map((item) => {
      const dueAt = item.dueAt ?? item.dueDate ?? null;
      const itemStatus = item.status ?? (dueAt ? "assigned" : "done");
      const attachments = Array.isArray(item.attachments)
        ? item.attachments.map((file) =>
            typeof file === "string"
              ? { name: file, detail: "Attachment" }
              : file
          )
        : [];

      return {
        ...item,
        title: item.title ?? item.name,
        instructions: item.instructions ?? item.description ?? "",
        dueDate: item.dueDate ?? dueAt ?? "No due date",
        dueAt,
        status: itemStatus,
        attachments,
        submittedCount: item.submittedCount ?? item.submissionCount ?? 0,
        totalCount:
          item.totalCount ??
          (item.submittedCount ? item.submittedCount + 2 : 24),
      };
    });
  }, [coursework]);

  const groups = ["This week", "Upcoming", "Past"];

  const handleAttachmentUpload = async (event, item) => {
    const file = event.target.files?.[0];
    if (!file || !item?.id) return;

    setIsUploading(true);
    setSubmissionError("");

    try {
      const uploadRequest = await requestUploadUrl(
        buildUploadRequestBody({
          name: file.name,
          type: file.type,
          size: file.size,
          resourceId: item.id,
        })
      ).unwrap();

      const uploadUrl =
        uploadRequest.uploadUrl ||
        uploadRequest.url ||
        uploadRequest?.data?.uploadUrl;

      if (
        !uploadUrl ||
        !uploadRequest.publicId ||
        !uploadRequest.uploadApiKey ||
        !uploadRequest.uploadSignature
      ) {
        throw new Error("The file upload service is not configured.");
      }

      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append("api_key", uploadRequest.uploadApiKey);
      uploadForm.append("timestamp", String(uploadRequest.uploadTimestamp));
      uploadForm.append("signature", uploadRequest.uploadSignature);
      uploadForm.append("public_id", uploadRequest.publicId);
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body: uploadForm,
      });
      if (!uploadResponse.ok) throw new Error("Cloudinary upload failed.");

      const completedAttachment = await completeUpload({
        attachmentId:
          uploadRequest.id ??
          uploadRequest.attachmentId ??
          `attachment-${item.id}`,
        payload: {
          publicId: uploadRequest.publicId,
          sizeBytes: file.size,
        },
      }).unwrap();

      const attachment = completedAttachment?.id
        ? completedAttachment
        : {
            id:
              uploadRequest.id ??
              uploadRequest.attachmentId ??
              `${item.id}-${Date.now()}`,
            name: file.name,
            detail: `${(file.size / 1024).toFixed(1)} KB`,
            downloadUrl: uploadRequest.downloadUrl ?? null,
          };

      setUploadedAttachmentsByItem((current) => ({
        ...current,
        [item.id]: [...(current[item.id] ?? []), attachment],
      }));
    } catch (requestError) {
      setSubmissionError(
        requestError?.message || "Unable to upload this file right now."
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (item) => {
    if (!classId || !item?.id) return;
    setIsSubmitting(true);
    setSubmissionError("");

    try {
      await startSubmission({
        courseworkId: item.id,
        payload: {
          content: draftSubmission[item.id] ?? "",
          submitted: true,
          attachments: uploadedAttachmentsByItem[item.id] ?? [],
        },
      }).unwrap();
      setDraftSubmission((current) => ({ ...current, [item.id]: "" }));
    } catch (requestError) {
      setSubmissionError(
        requestError?.message || "Unable to submit this assignment right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGrade = async (item, submission) => {
    if (!item?.id || !submission?.id) return;
    const gradeValue = Number(
      gradeDrafts[submission.id] ?? submission.score ?? 0
    );
    setIsGrading(true);
    setGradingError("");

    try {
      await gradeSubmission({
        courseworkId: item.id,
        submissionId: submission.id,
        payload: {
          score: gradeValue,
          status: "graded",
        },
      }).unwrap();
      setGradeDrafts((current) => ({ ...current, [submission.id]: "" }));
    } catch (requestError) {
      setGradingError(
        requestError?.message || "Unable to grade this submission."
      );
    } finally {
      setIsGrading(false);
    }
  };

  const handleAddComment = async (item) => {
    const content = (commentDrafts[item.id] ?? "").trim();
    if (!content || !classId || !item?.id) return;
    setCommentError("");

    try {
      const nextComment = await addCourseworkComment({
        courseId: classId,
        courseworkId: item.id,
        payload: { content },
      }).unwrap();

      setCommentsByItem((current) => ({
        ...current,
        [item.id]: [
          ...(current[item.id] ?? courseworkComments ?? []),
          nextComment,
        ],
      }));
      setCommentDrafts((current) => ({ ...current, [item.id]: "" }));
    } catch (requestError) {
      setCommentError(requestError?.message || "Unable to post this comment.");
    }
  };

  const handleAddSubmissionFeedback = async (item, submission) => {
    const content = (feedbackDrafts[submission.id] ?? "").trim();
    if (!content || !submission?.id) return;

    try {
      await addSubmissionComment({
        submissionId: submission.id,
        payload: { content },
      }).unwrap();
      setFeedbackDrafts((current) => ({ ...current, [submission.id]: "" }));
    } catch (requestError) {
      setGradingError(requestError?.message || "Unable to send feedback.");
    }
  };

  if (!isEnrolled) {
    return (
      <div className="mt-4 rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
          <ClipboardList className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-text-heading">
          Classwork is reserved for enrolled students
        </h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-text-muted">
          Join this class to access assignments, view learning materials, and submit coursework.
        </p>
        {onJoin && (
          <Button onClick={onJoin} loading={isJoining} className="mt-4 gap-2">
            <UserPlus className="h-4 w-4" />
            Join Class
          </Button>
        )}
      </div>
    );
  }

  if (isLoading && !coursework.length) {
    return (
      <div className="mt-4 rounded-2xl bg-surface p-6 text-sm text-text-muted ring-1 ring-border">
        Loading classwork…
      </div>
    );
  }

  if (error && !coursework.length) {
    return (
      <div className="mt-4 rounded-2xl bg-surface p-6 text-sm text-text-muted ring-1 ring-border">
        Unable to load classwork at the moment.
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
      <main className="space-y-4">
        {teacher && (
          <div className="flex justify-end">
            <div className="relative">
              <Button onClick={() => setCreateOpen(!createOpen)}>
                <Plus aria-hidden="true" />
                Create
              </Button>
              {createOpen && (
                <div className="absolute right-0 z-10 mt-2 w-44 rounded-xl bg-surface p-1 shadow-sm ring-1 ring-border">
                  {["Assignment", "Quiz", "Material"].map((item) => (
                    <Button
                      key={item}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setCreateOpen(false)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {items.length === 0 ? (
          <EmptyState
            title="No classwork posted yet"
            description="New assignments and materials will appear here."
            action={
              teacher ? { label: "Create your first assignment" } : undefined
            }
          />
        ) : (
          groups.map((group) => {
            const groupItems = items.filter((x) => {
              if (x?.temporalStatus) {
                if (group === "This week") return x.temporalStatus === "THIS_WEEK";
                if (group === "Upcoming") return x.temporalStatus === "UPCOMING" || x.temporalStatus === "NO_DUE_DATE";
                if (group === "Past") return x.temporalStatus === "PAST";
              }
              const due = x?.dueAt ? new Date(x.dueAt) : null;
              if (!due || isNaN(due.getTime())) {
                return group === "Upcoming";
              }
              const now = new Date();
              if (group === "Past") return due < now;
              const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
              if (group === "This week") return due >= now && due <= nextWeek;
              return due > nextWeek;
            });

            return groupItems.length ? (
              <section key={group}>
                <h2 className="mb-2 text-lg font-bold text-text-heading">
                  {group}
                </h2>
                <div className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-border divide-y divide-border">
                  {groupItems.map((item) => {
                    const Icon = typeIcon[item.type] ?? ClipboardList;
                    const open = expanded === item.id;
                    const detailItem =
                      open && expandedCoursework ? expandedCoursework : item;

                    return (
                      <div key={item.id}>
                        <button
                          onClick={() => setExpanded(open ? null : item.id)}
                          className="flex w-full items-center gap-3 px-4 py-4 text-left hover:bg-canvas"
                        >
                          <div className="rounded-lg bg-primary/10 p-2 text-primary">
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-text-heading">
                              {item.title}
                            </p>
                            <p className="mt-0.5 text-xs text-text-muted">
                              {item.dueDate}
                            </p>
                          </div>
                          <Chip status={item.status} />
                        </button>
                        {open && (
                          <div className="border-t border-border bg-canvas/50 px-4 py-4">
                            <p className="text-sm leading-6 text-text-main">
                              {detailItem.instructions ||
                                detailItem.description ||
                                "No detailed instructions available yet."}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {[
                                ...(detailItem.attachments || []),
                                ...(uploadedAttachmentsByItem[item.id] || []),
                              ].map((file) => (
                                <Attachment
                                  key={`${detailItem.id}-${
                                    file.id ??
                                    file.name ??
                                    file.url ??
                                    file.title ??
                                    "attachment"
                                  }`}
                                  size="sm"
                                  className="border-border bg-surface"
                                >
                                  <AttachmentMedia>
                                    <Paperclip />
                                  </AttachmentMedia>
                                  <AttachmentContent>
                                    <AttachmentTitle>
                                      {file.name ?? file.title ?? "Attachment"}
                                    </AttachmentTitle>
                                    <AttachmentDescription>
                                      {file.detail ?? file.size ?? "File"}
                                    </AttachmentDescription>
                                  </AttachmentContent>
                                </Attachment>
                              ))}
                            </div>
                            {teacher ? (
                              <div className="mt-4 space-y-4">
                                <div className="flex justify-between text-xs text-text-muted">
                                  <span>
                                    {detailItem.submittedCount} of{" "}
                                    {detailItem.totalCount} submitted
                                  </span>
                                  <span>
                                    {Math.round(
                                      (detailItem.submittedCount /
                                        Math.max(detailItem.totalCount, 1)) *
                                        100
                                    )}
                                    %
                                  </span>
                                </div>
                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
                                  <div
                                    className="h-full bg-success"
                                    style={{
                                      width: `${
                                        (detailItem.submittedCount /
                                          Math.max(detailItem.totalCount, 1)) *
                                        100
                                      }%`,
                                    }}
                                  />
                                </div>
                                <div className="rounded-xl border border-border bg-surface p-3">
                                  <p className="mb-2 text-sm font-medium text-text-heading">
                                    Coursework comments
                                  </p>
                                  {(
                                    commentsByItem[item.id] ??
                                    courseworkComments ??
                                    []
                                  ).length === 0 ? (
                                    <p className="text-xs text-text-muted">
                                      No comments yet.
                                    </p>
                                  ) : (
                                    <div className="space-y-2">
                                      {(
                                        commentsByItem[item.id] ??
                                        courseworkComments ??
                                        []
                                      ).map((comment) => (
                                        <div
                                          key={
                                            comment.id ??
                                            `${item.id}-${comment.content}`
                                          }
                                          className="rounded-lg bg-canvas px-2 py-2"
                                        >
                                          <p className="text-xs text-text-muted">
                                            {comment.author?.name ?? "Teacher"}
                                          </p>
                                          <p className="text-sm text-text-main">
                                            {comment.content}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  <div className="mt-3 flex gap-2">
                                    <textarea
                                      value={commentDrafts[item.id] ?? ""}
                                      onChange={(event) =>
                                        setCommentDrafts((current) => ({
                                          ...current,
                                          [item.id]: event.target.value,
                                        }))
                                      }
                                      rows="2"
                                      className="flex-1 resize-none rounded-lg border border-border bg-canvas px-2 py-2 text-sm text-text-main outline-none focus:ring-2 focus:ring-focus"
                                      placeholder="Add a classroom comment"
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => handleAddComment(item)}
                                    >
                                      Post
                                    </Button>
                                  </div>
                                  {commentError && (
                                    <p className="mt-2 text-xs text-secondary">
                                      {commentError}
                                    </p>
                                  )}
                                </div>
                                {submissionList.length > 0 && (
                                  <div className="space-y-3">
                                    {submissionList.map((submission) => (
                                      <div
                                        key={submission.id}
                                        className="rounded-xl border border-border bg-surface p-3"
                                      >
                                        <div className="flex items-center justify-between gap-2">
                                          <p className="text-sm font-medium text-text-heading">
                                            {submission.user?.name ??
                                              "Student submission"}
                                          </p>
                                          <span className="text-xs text-text-muted">
                                            {submission.status ?? "new"}
                                          </span>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                          <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={
                                              gradeDrafts[submission.id] ??
                                              submission.score ??
                                              ""
                                            }
                                            onChange={(event) =>
                                              setGradeDrafts((current) => ({
                                                ...current,
                                                [submission.id]:
                                                  event.target.value,
                                              }))
                                            }
                                            className="w-24 rounded-lg border border-border bg-canvas px-2 py-1.5 text-sm text-text-heading outline-none focus:ring-2 focus:ring-focus"
                                            placeholder="Score"
                                          />
                                          <Button
                                            size="sm"
                                            onClick={() =>
                                              handleGrade(item, submission)
                                            }
                                            disabled={isGrading}
                                          >
                                            Save grade
                                          </Button>
                                        </div>
                                        <div className="mt-3 flex gap-2">
                                          <input
                                            value={
                                              feedbackDrafts[submission.id] ??
                                              ""
                                            }
                                            onChange={(event) =>
                                              setFeedbackDrafts((current) => ({
                                                ...current,
                                                [submission.id]:
                                                  event.target.value,
                                              }))
                                            }
                                            className="flex-1 rounded-lg border border-border bg-canvas px-2 py-1.5 text-sm text-text-heading outline-none focus:ring-2 focus:ring-focus"
                                            placeholder="Add feedback"
                                          />
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              handleAddSubmissionFeedback(
                                                item,
                                                submission
                                              )
                                            }
                                          >
                                            Send
                                          </Button>
                                        </div>
                                        {gradingError && (
                                          <p className="mt-2 text-xs text-secondary">
                                            {gradingError}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="mt-4 space-y-4 rounded-xl bg-surface p-3 ring-1 ring-border">
                                <div>
                                  <p className="mb-2 text-sm font-medium text-text-heading">
                                    Comments
                                  </p>
                                  {(
                                    commentsByItem[item.id] ??
                                    courseworkComments ??
                                    []
                                  ).length === 0 ? (
                                    <p className="text-xs text-text-muted">
                                      No comments yet.
                                    </p>
                                  ) : (
                                    <div className="space-y-2">
                                      {(
                                        commentsByItem[item.id] ??
                                        courseworkComments ??
                                        []
                                      ).map((comment) => (
                                        <div
                                          key={
                                            comment.id ??
                                            `${item.id}-${comment.content}`
                                          }
                                          className="rounded-lg bg-canvas px-2 py-2"
                                        >
                                          <p className="text-xs text-text-muted">
                                            {comment.author?.name ?? "Teacher"}
                                          </p>
                                          <p className="text-sm text-text-main">
                                            {comment.content}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <textarea
                                  value={draftSubmission[item.id] ?? ""}
                                  onChange={(event) =>
                                    setDraftSubmission((current) => ({
                                      ...current,
                                      [item.id]: event.target.value,
                                    }))
                                  }
                                  className="w-full resize-none bg-transparent text-sm text-text-main outline-none"
                                  rows="2"
                                  placeholder="Add a private comment with your submission…"
                                />
                                {submissionError && (
                                  <p className="mt-2 text-xs text-secondary">
                                    {submissionError}
                                  </p>
                                )}
                                <div className="mt-2 flex justify-between gap-2">
                                  <div>
                                    <input
                                      ref={(element) => {
                                        fileInputRefs.current[item.id] =
                                          element;
                                      }}
                                      type="file"
                                      className="hidden"
                                      onChange={(event) =>
                                        handleAttachmentUpload(event, item)
                                      }
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        fileInputRefs.current[item.id]?.click()
                                      }
                                      disabled={isUploading}
                                    >
                                      <Upload />
                                      {isUploading ? "Uploading…" : "Add file"}
                                    </Button>
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => handleSubmit(item)}
                                    disabled={isSubmitting}
                                  >
                                    {isSubmitting ? "Submitting…" : "Submit"}
                                  </Button>
                                </div>
                                <div className="flex gap-2">
                                  <textarea
                                    value={commentDrafts[item.id] ?? ""}
                                    onChange={(event) =>
                                      setCommentDrafts((current) => ({
                                        ...current,
                                        [item.id]: event.target.value,
                                      }))
                                    }
                                    rows="2"
                                    className="flex-1 resize-none rounded-lg border border-border bg-canvas px-2 py-2 text-sm text-text-main outline-none focus:ring-2 focus:ring-focus"
                                    placeholder="Add class comment"
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddComment(item)}
                                  >
                                    Comment
                                  </Button>
                                </div>
                                {commentError && (
                                  <p className="mt-2 text-xs text-secondary">
                                    {commentError}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : null;
          })
        )}
      </main>
      <UpcomingPanel items={items} />
    </div>
  );
}

function Members({
  classroom,
  teacher,
  isEnrolled = true,
  onJoin,
  isJoining = false,
}) {
  const [query, setQuery] = useState("");
  const [confirming, setConfirming] = useState(null);
  const [inviteEnabled, setInviteEnabled] = useState(true);
  const { authStatus } = useAuth();
  const { data: roster = [] } = useGetClassroomRosterQuery(classroom.id, {
    skip: authStatus === "hydrating" || !classroom.id || !isEnrolled,
  });
  const members = roster.filter((member) =>
    String(member?.name || member?.displayName || "")
      .toLowerCase()
      .includes(query.toLowerCase())
  );
  const teachers = members.filter((x) => {
    const r = String(x?.role || "").toLowerCase();
    return r === "teacher" || r === "owner";
  });
  const students = members.filter(
    (x) => String(x?.role || "").toLowerCase() === "student"
  );
  const Row = ({ member }) => {
    const memberName =
      member?.name ||
      member?.displayName ||
      (member?.userId ? `Member (${member.userId.slice(-4)})` : "Class Member");
    const memberId = member?.id || member?.userId || "";
    const isTeacherRole =
      String(member?.role || "").toLowerCase() === "teacher" ||
      String(member?.role || "").toLowerCase() === "owner";
    return (
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="relative">
          <ClassroomAvatar
            name={memberName}
            avatar={member?.avatar || member?.avatarUrl}
            size="h-10 w-10"
          />
          {member?.online && (
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-success" />
          )}
        </div>
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-main">
          {memberName}
        </span>
        {isTeacherRole && (
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-0.5 text-[11px] font-medium text-secondary">
            {String(member?.role).toLowerCase() === "owner" ? "Owner" : "Teacher"}
          </span>
        )}
        <Button
          to={`/dashboard/messages?member=${memberId}`}
          variant="ghost"
          size="icon-sm"
          aria-label={`Message ${memberName}`}
        >
          <MessageCircle aria-hidden="true" />
        </Button>
        {teacher && !isTeacherRole && (
          <div className="relative">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Manage ${memberName}`}
              onClick={() =>
                setConfirming(confirming === memberId ? null : memberId)
              }
            >
              <MoreVertical aria-hidden="true" />
            </Button>
            {confirming === memberId && (
              <div className="absolute right-0 top-9 z-10 w-56 rounded-xl bg-surface p-3 shadow-sm ring-1 ring-border">
                <p className="text-xs text-text-muted">
                  Remove {memberName} from this class?
                </p>
              <div className="mt-2 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirming(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setConfirming(null)}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
  };

  if (!isEnrolled) {
    return (
      <section className="mt-4">
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
            <UserPlus className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-text-heading">
            Class roster is only available to members
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-text-muted">
            Join this class to view students and teachers and connect with classmates.
          </p>
          {onJoin && (
            <Button onClick={onJoin} loading={isJoining} className="mt-4 gap-2">
              <UserPlus className="h-4 w-4" />
              Join Class
            </Button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-4">
      <div className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-border sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-primary">CLASS ROSTER</p>
            <h2 className="text-2xl font-bold tracking-tight text-text-heading">
              Members
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              {classroom.memberCount || members.length} members in this class
            </p>
          </div>
          {teacher && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInviteEnabled(!inviteEnabled)}
              >
                <Ticket aria-hidden="true" />
                {inviteEnabled ? `Code: ${classroom.code}` : "Code disabled"}
              </Button>
              <Button variant="outline" size="sm">
                Regenerate
              </Button>
            </div>
          )}
        </div>
        <div className="relative mt-5">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search members…"
            className="w-full rounded-lg border border-border bg-canvas py-2 pl-9 pr-3 text-sm text-text-main outline-none focus:ring-2 focus:ring-focus/30"
          />
        </div>
        {members.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              title="No members found"
              description="Try a different name or spelling."
            />
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-text-heading">
                Teachers
              </h3>
              <div className="overflow-visible rounded-xl ring-1 ring-border divide-y divide-border">
                {teachers.map((m) => (
                  <Row key={m.id} member={m} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-text-heading">
                Students
              </h3>
              <div className="grid overflow-visible rounded-xl ring-1 ring-border divide-y divide-border sm:grid-cols-2 sm:divide-x">
                {students.map((m) => (
                  <Row key={m.id} member={m} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
function Grades({
  teacher,
  isEnrolled = true,
  onJoin,
  isJoining = false,
}) {
  const [selected, setSelected] = useState(null);
  const { classId } = useParams();
  const { user, authStatus } = useAuth();
  const { data: studentRows = [] } = useGetStudentGradebookQuery(
    { courseId: classId, studentId: user?.id },
    { skip: authStatus === "hydrating" || teacher || !user?.id || !isEnrolled }
  );
  const { data: teacherRows = [] } = useGetTeacherGradebookQuery(classId, {
    skip: authStatus === "hydrating" || !teacher || !classId || !isEnrolled,
  });
  const { data: summary } = useGetCourseAnalyticsSummaryQuery(classId, {
    skip: authStatus === "hydrating" || !teacher || !classId || !isEnrolled,
  });

  const rows = teacher ? teacherRows : studentRows;

  if (!isEnrolled) {
    return (
      <section className="mt-4">
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
            <ClipboardList className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-text-heading">
            Gradebook is reserved for enrolled students
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-text-muted">
            Join this class to track your grades, missing assignments, and class standing.
          </p>
          {onJoin && (
            <Button onClick={onJoin} loading={isJoining} className="mt-4 gap-2">
              <UserPlus className="h-4 w-4" />
              Join Class
            </Button>
          )}
        </div>
      </section>
    );
  }

  const metrics = teacher
    ? [
        [
          "Class average",
          summary?.averageScore != null
            ? `${Math.round(summary.averageScore)}%`
            : "—",
        ],
        ["Missing submissions", String(summary?.missingCount ?? 0)],
        ["Submissions received", String(summary?.submissionCount ?? 0)],
      ]
    : [
        [
          "Your grade",
          studentRows.some((r) => r.score != null && r.outOf)
            ? `${Math.round(
                (studentRows.reduce((acc, r) => acc + (r.score ?? 0), 0) /
                  Math.max(
                    1,
                    studentRows.reduce((acc, r) => acc + (r.outOf ?? 0), 0)
                  )) *
                  100
              )}%`
            : "—",
        ],
        [
          "Assignments graded",
          `${studentRows.filter((r) => r.score != null).length} of ${studentRows.length}`,
        ],
        [
          "Missing submissions",
          String(studentRows.filter((r) => r.status === "missing").length),
        ],
      ];
  return (
    <section className="mt-4 space-y-4">
      <header>
        <p className="text-sm font-bold text-primary">GRADEBOOK</p>
        <h2 className="text-2xl font-bold tracking-tight text-text-heading">
          Grades
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          {teacher
            ? "Track class progress and review individual student work."
            : "See your submitted work and grades for this class."}
        </p>
      </header>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {metrics.map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl bg-surface p-4 shadow-sm ring-1 ring-border"
          >
            <p className="text-xs font-medium text-text-muted">{label}</p>
            <p className="mt-1 text-2xl font-bold text-text-heading">{value}</p>
          </div>
        ))}
      </div>
      {rows.length === 0 ? (
        <EmptyState
          title="No grades available yet"
          description="Grades will appear here as work is reviewed."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-surface ring-1 ring-border">
          <table className="w-full min-w-155 text-left text-sm">
            <thead className="border-b border-border bg-canvas/60 text-xs text-text-muted">
              <tr>
                {teacher ? (
                  <>
                    <th className="px-4 py-3 font-medium">Student</th>
                    <th className="px-4 py-3 font-medium">Average</th>
                    <th className="px-4 py-3 font-medium">Missing</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-3 font-medium">Assignment</th>
                    <th className="px-4 py-3 font-medium">Due date</th>
                    <th className="px-4 py-3 font-medium">Score</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {teacher
                ? rows.map((row) => (
                    <Fragment key={row.id}>
                      <tr>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <ClassroomAvatar
                              name={row.studentName}
                              avatar={row.avatar}
                              size="h-8 w-8"
                            />
                            {row.studentName}
                          </div>
                        </td>
                        <td
                          className={`px-4 py-3 font-medium ${
                            row.average === "—"
                              ? "text-text-muted"
                              : "text-text-main"
                          }`}
                        >
                          {row.average}
                        </td>
                        <td className="px-4 py-3">{row.missingCount || "—"}</td>
                        <td className="px-4 py-3">
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() =>
                              setSelected(selected === row.id ? null : row.id)
                            }
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                      {selected === row.id && (
                        <tr key={`${row.id}-detail`}>
                          <td
                            colSpan="4"
                            className="bg-canvas/50 px-4 py-3 text-sm text-text-muted"
                          >
                            Breakdown for {row.studentName}: {row.submittedCount ?? 0} assignments submitted · {row.missingCount ?? 0} missing.
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))
                : rows.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-3 font-medium text-text-main">
                        {row.assignmentTitle}
                      </td>
                      <td className="px-4 py-3 text-text-muted">
                        {row.dueDate}
                      </td>
                      <td
                        className={`px-4 py-3 font-medium ${
                          row.score === null
                            ? "text-text-muted"
                            : "text-text-main"
                        }`}
                      >
                        {row.score === null ? "—" : `${row.score}/${row.outOf}`}
                      </td>
                      <td className="px-4 py-3">
                        <Chip status={row.status} />
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
export default function ClassPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "home";
  const { classId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const { classroom, error, notFound, isEnrolled, isLoading } =
    useClassroom(classId);

  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  const handleJoin = async () => {
    if (!classId || isJoining) return;
    setIsJoining(true);
    setJoinError("");
    try {
      await joinClassroom(user?.id, { courseId: classId });
      triggerLifecycleRefresh("course:joined", { courseId: classId });
    } catch (err) {
      setJoinError(
        err?.data?.error || err?.message || "Failed to join class. Please try again."
      );
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading && !classroom)
    return (
      <div className="grid min-h-screen place-items-center bg-canvas text-text-muted">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm">Loading class…</p>
        </div>
      </div>
    );
  if (notFound)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 text-center">
        <div className="max-w-md rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-border">
          <h2 className="text-lg font-semibold text-text-heading">
            Classroom Not Found
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            This classroom is unavailable or you are not enrolled as a member yet.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link
              to={`/dashboard/class/join?courseId=${encodeURIComponent(classId || "")}`}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
            >
              Join this class
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-main transition hover:bg-canvas"
            >
              Back to classes
            </Link>
          </div>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="grid min-h-screen place-items-center bg-canvas text-text-muted">
        This class is unavailable.
      </div>
    );
  if (!classroom)
    return (
      <div className="grid min-h-screen place-items-center bg-canvas text-text-muted">
        Class not found.
      </div>
    );

  const teacher = isTeacherRole(classroom.role);

  const classroomWithNewCode =
    classroom.code || !location.state?.enrollmentCode
      ? classroom
      : { ...classroom, code: location.state.enrollmentCode };

  return (
    <div className="min-h-screen bg-canvas px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {joinError && (
          <div className="mb-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
            {joinError}
          </div>
        )}
        <ClassHeader
          classroom={classroomWithNewCode}
          isEnrolled={isEnrolled}
          onJoin={handleJoin}
          isJoining={isJoining}
        />
        <ClassTabs
          active={activeTab}
          onChange={(nextTab) => {
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              if (nextTab === "home") {
                next.delete("tab");
              } else {
                next.set("tab", nextTab);
              }
              return next;
            });
          }}
        />
        {activeTab === "home" && (
          <Home
            isEnrolled={isEnrolled}
            onJoin={handleJoin}
            isJoining={isJoining}
            classroom={classroom}
          />
        )}
        {activeTab === "classwork" && (
          <Classwork
            teacher={teacher}
            classId={classId}
            isEnrolled={isEnrolled}
            onJoin={handleJoin}
            isJoining={isJoining}
          />
        )}
        {activeTab === "quick-links" && <ClassQuickLinks teacher={teacher} />}
        {activeTab === "members" && (
          <Members
            classroom={classroom}
            teacher={teacher}
            isEnrolled={isEnrolled}
            onJoin={handleJoin}
            isJoining={isJoining}
          />
        )}
        {activeTab === "grades" && (
          <Grades
            teacher={teacher}
            isEnrolled={isEnrolled}
            onJoin={handleJoin}
            isJoining={isJoining}
          />
        )}
      </div>
    </div>
  );
}
