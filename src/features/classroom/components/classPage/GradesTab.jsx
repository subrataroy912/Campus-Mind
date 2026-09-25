import { Fragment, useMemo, useState } from "react";
import { useParams } from "react-router";
import { Award, ClipboardList, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { ClassroomAvatar } from "../ClassroomAvatar.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useGetCourseAnalyticsSummaryQuery,
  useGetStudentGradebookQuery,
  useGetCourseGradebookQuery,
} from "../../api/courseworkApi.js";
import {
  useActiveCourseId,
  useCourseIsStaff,
  useCourseIsEnrolled,
} from "../../hooks/useCourseContext.js";

const statusClass = {
  assigned: "bg-canvas text-text-main border border-border",
  "due-soon": "bg-primary/10 text-primary border border-primary/20",
  missing: "bg-destructive/10 text-destructive border border-destructive/20",
  done: "bg-success/10 text-success border border-success/20",
  graded: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
};

const statusLabel = {
  assigned: "Assigned",
  "due-soon": "Due soon",
  missing: "Missing",
  done: "Turned In",
  graded: "Graded",
};

function GradeChip({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium tracking-tight ${
        statusClass[status] || statusClass.assigned
      }`}
    >
      {statusLabel[status] || "Assigned"}
    </span>
  );
}

export function GradesTab({
  classId: propClassId,
  classroom,
  isStaff: isStaffProp,
  isEnrolled: isEnrolledProp,
}) {
  const contextCourseId = useActiveCourseId();
  const contextIsStaff = useCourseIsStaff();
  const contextIsEnrolled = useCourseIsEnrolled();
  const { classId: routeClassId } = useParams();
  const classId = propClassId || classroom?.id || routeClassId || contextCourseId;
  const isStaff = isStaffProp !== undefined ? Boolean(isStaffProp) : (contextIsStaff ?? false);
  const isEnrolled = isEnrolledProp !== undefined ? isEnrolledProp : (contextIsEnrolled ?? true);
  const [selected, setSelected] = useState(null);
  const { user, authStatus } = useAuth();
  const isHydrating = authStatus === "hydrating";

  // Student gradebook — skip via skipToken; selectFromResult exposes rows and loading state
  const { studentRows = [], isLoading: isLoadingStudentGrades = false } =
    useGetStudentGradebookQuery(
      isHydrating || isStaff || !user?.id || !classId || !isEnrolled
        ? skipToken
        : { courseId: classId, studentId: user.id },
      {
        selectFromResult: ({ data, isLoading }) => ({
          studentRows: data ?? [],
          isLoading: Boolean(isLoading),
        }),
      },
    );

  // Staff gradebook — skip via skipToken; selectFromResult exposes rows and loading state
  const { gradebookRows = [], isLoading: isLoadingCourseGrades = false } =
    useGetCourseGradebookQuery(
      isHydrating || !isStaff || !classId || !isEnrolled ? skipToken : classId,
      {
        selectFromResult: ({ data, isLoading }) => ({
          gradebookRows: data ?? [],
          isLoading: Boolean(isLoading),
        }),
      },
    );

  // Analytics summary — staff-only
  const { data: summary } = useGetCourseAnalyticsSummaryQuery(
    isHydrating || !isStaff || !classId || !isEnrolled ? skipToken : classId,
  );

  const rows = isStaff ? gradebookRows : studentRows;
  const isLoadingGrades = isStaff ? isLoadingCourseGrades : isLoadingStudentGrades;

  const metrics = useMemo(() => {
    if (isStaff) {
      return [
        [
          "Class average",
          summary?.averageScore != null
            ? `${Math.round(summary.averageScore)}%`
            : "—",
        ],
        ["Missing submissions", String(summary?.missingCount ?? 0)],
        ["Submissions received", String(summary?.submissionCount ?? 0)],
      ];
    }

    const totalScore = studentRows.reduce((acc, r) => acc + (r.score ?? 0), 0);
    const totalPossible = studentRows.reduce((acc, r) => acc + (r.outOf ?? 0), 0);
    const hasScores = studentRows.some((r) => r.score != null && r.outOf);
    const gradedCount = studentRows.filter((r) => r.score != null).length;
    const missingCount = studentRows.filter((r) => r.status === "missing").length;

    return [
      [
        "Your grade",
        hasScores ? `${Math.round((totalScore / Math.max(1, totalPossible)) * 100)}%` : "—",
      ],
      ["Assignments graded", `${gradedCount} of ${studentRows.length}`],
      ["Missing submissions", String(missingCount)],
    ];
  }, [isStaff, summary, studentRows]);

  if (!isEnrolled) {
    return (
      <section className="mt-2">
        <div className="rounded-lg border border-dashed border-border bg-surface p-6 sm:p-8 text-center shadow-xs">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2.5">
            <Award className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-sm font-semibold text-text-heading">
            Gradebook is reserved for enrolled members
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-text-muted">
            Join this space to track your grades, missing assignments, and space standing.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-3 space-y-3">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-text-heading">
            Grades & Performance
          </h2>
          <p className="text-xs text-text-muted">
            {isStaff
              ? "Track space standing, review scores, and monitor submission trends."
              : "Review your submitted work, scores, and feedback."}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {metrics.map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border border-border/80 bg-surface px-3.5 py-2.5 shadow-xs"
          >
            <p className="text-[11px] font-medium text-text-muted">{label}</p>
            <p className="mt-0.5 text-xl font-semibold tracking-tight text-text-heading">
              {value}
            </p>
          </div>
        ))}
      </div>

      {isLoadingGrades && rows.length === 0 ? (
        <div className="rounded-lg border border-border/80 bg-surface p-6 text-center text-xs text-text-muted shadow-xs">
          Loading gradebook…
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          title="No grades available yet"
          description="Grades will appear here as coursework is completed and reviewed."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border/80 bg-surface shadow-xs">
          <table className="w-full min-w-140 text-left text-xs">
            <thead className="border-b border-border/70 bg-canvas/60 text-[11px] font-medium text-text-muted uppercase tracking-wider">
              <tr>
                {isStaff ? (
                  <>
                    <th className="px-3.5 py-2">Student</th>
                    <th className="px-3.5 py-2">Average</th>
                    <th className="px-3.5 py-2">Missing</th>
                    <th className="px-3.5 py-2 text-right">Action</th>
                  </>
                ) : (
                  <>
                    <th className="px-3.5 py-2">Assignment</th>
                    <th className="px-3.5 py-2">Due date</th>
                    <th className="px-3.5 py-2">Score</th>
                    <th className="px-3.5 py-2 text-right">Status</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isStaff
                ? rows.map((row) => (
                    <Fragment key={row.id}>
                      <tr className="hover:bg-canvas/40 transition-colors">
                        <td className="px-3.5 py-2">
                          <div className="flex items-center gap-2">
                            <ClassroomAvatar
                              name={row.studentName || row.memberName}
                              avatar={row.avatar}
                              size="h-6 w-6"
                            />
                            <span className="font-medium text-text-heading">
                              {row.studentName || row.memberName}
                            </span>
                          </div>
                        </td>
                        <td
                          className={`px-3.5 py-2 font-medium ${
                            row.average === "—"
                              ? "text-text-muted"
                              : "text-text-main"
                          }`}
                        >
                          {row.average}
                        </td>
                        <td className="px-3.5 py-2 text-text-muted">
                          {row.missingCount || "—"}
                        </td>
                        <td className="px-3.5 py-2 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setSelected(selected === row.id ? null : row.id)
                            }
                            className="h-6 px-2 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10"
                          >
                            {selected === row.id ? "Hide details" : "View breakdown"}
                          </Button>
                        </td>
                      </tr>
                      {selected === row.id && (
                        <tr key={`${row.id}-detail`}>
                          <td
                            colSpan="4"
                            className="bg-canvas/50 px-3.5 py-2 text-xs text-text-muted leading-relaxed"
                          >
                            Breakdown for <strong className="text-text-heading">{row.studentName || row.memberName}</strong>: {row.submittedCount ?? 0} assignments submitted · {row.missingCount ?? 0} missing.
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))
                : rows.map((row) => (
                    <tr key={row.id} className="hover:bg-canvas/40 transition-colors">
                      <td className="px-3.5 py-2 font-medium text-text-heading">
                        {row.assignmentTitle}
                      </td>
                      <td className="px-3.5 py-2 text-text-muted">
                        {row.dueDate}
                      </td>
                      <td
                        className={`px-3.5 py-2 font-medium ${
                          row.score === null
                            ? "text-text-muted"
                            : "text-text-main"
                        }`}
                      >
                        {row.score === null ? "—" : `${row.score}/${row.outOf}`}
                      </td>
                      <td className="px-3.5 py-2 text-right">
                        <GradeChip status={row.status} />
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
