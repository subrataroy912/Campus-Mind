import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import {
  useGetSubmissionListQuery,
  useGradeSubmissionMutation,
} from "../../api/courseworkApi.js";
import { useAddSubmissionCommentMutation } from "../../api/commentApi.js";

export function CourseworkGradingSection({
  item,
  classId,
  isHydrating,
  isOpen,
}) {
  const [feedbackDrafts, setFeedbackDrafts] = useState({});
  const [gradeDrafts, setGradeDrafts] = useState({});
  const [isGrading, setIsGrading] = useState(false);
  const [gradingError, setGradingError] = useState("");

  const { data: submissionPage } = useGetSubmissionListQuery(
    { courseworkId: item.id, page: 0, size: 20 },
    { skip: isHydrating || !classId || !item.id || !isOpen }
  );

  const [gradeSubmission] = useGradeSubmissionMutation();
  const [addSubmissionComment] = useAddSubmissionCommentMutation();

  const submissionList = submissionPage?.content ?? [];
  const submittedCount = item.submittedCount ?? 0;
  const totalCount = Math.max(item.totalCount ?? 1, 1);
  const percentComplete = Math.round((submittedCount / totalCount) * 100);

  const handleGrade = async (submission) => {
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
      setGradeDrafts((curr) => ({ ...curr, [submission.id]: "" }));
    } catch (requestError) {
      setGradingError(
        requestError?.message || "Unable to grade this submission."
      );
    } finally {
      setIsGrading(false);
    }
  };

  const handleAddSubmissionFeedback = async (submission) => {
    const content = (feedbackDrafts[submission.id] ?? "").trim();
    if (!content || !submission?.id) return;

    try {
      await addSubmissionComment({
        submissionId: submission.id,
        payload: { content },
      }).unwrap();
      setFeedbackDrafts((curr) => ({ ...curr, [submission.id]: "" }));
    } catch (requestError) {
      setGradingError(requestError?.message || "Unable to send feedback.");
    }
  };

  return (
    <div className="space-y-4 pt-2 border-t border-border">
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>
          {submittedCount} of {item.totalCount ?? 0} submitted
        </span>
        <span className="font-semibold">{percentComplete}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-border">
        <div
          className="h-full bg-success transition-all duration-300"
          style={{ width: `${percentComplete}%` }}
        />
      </div>

      {submissionList.length > 0 && (
        <div className="space-y-3 pt-2">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Student Submissions
          </p>
          {submissionList.map((submission) => (
            <div
              key={submission.id}
              className="rounded-xl border border-border bg-surface p-3 space-y-3 shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-text-heading">
                  {submission.user?.name ?? "Student submission"}
                </p>
                <span className="text-xs text-text-muted capitalize">
                  {submission.status ?? "new"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={
                    gradeDrafts[submission.id] ??
                    submission.score ??
                    ""
                  }
                  onChange={(e) =>
                    setGradeDrafts((curr) => ({
                      ...curr,
                      [submission.id]: e.target.value,
                    }))
                  }
                  className="w-24 rounded-lg border border-border bg-canvas px-3 py-1.5 text-sm text-text-heading outline-none focus:ring-2 focus:ring-focus"
                  placeholder="Score"
                />
                <Button
                  size="sm"
                  onClick={() => handleGrade(submission)}
                  disabled={isGrading}
                >
                  Save grade
                </Button>
              </div>

              <div className="flex gap-2">
                <input
                  value={feedbackDrafts[submission.id] ?? ""}
                  onChange={(e) =>
                    setFeedbackDrafts((curr) => ({
                      ...curr,
                      [submission.id]: e.target.value,
                    }))
                  }
                  className="flex-1 rounded-lg border border-border bg-canvas px-3 py-1.5 text-sm text-text-heading outline-none focus:ring-2 focus:ring-focus"
                  placeholder="Add feedback for student…"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddSubmissionFeedback(submission)}
                >
                  Send
                </Button>
              </div>
            </div>
          ))}
          {gradingError && (
            <p className="text-xs text-secondary font-medium">
              {gradingError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
