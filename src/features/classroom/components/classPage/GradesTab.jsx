import { Fragment, useMemo, useState } from "react";
import { useParams } from "react-router";
import { Award, ClipboardList, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { ClassroomAvatar } from "../ClassroomAvatar.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import {
  useGetCourseAnalyticsSummaryQuery,
  useGetStudentGradebookQuery,
  useGetTeacherGradebookQuery,
} from "../../api/courseworkApi.js";

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
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
        statusClass[status] || statusClass.assigned
      }`}
    >
      {statusLabel[status] || "Assigned"}
    </span>
  );
}

export function GradesTab({
  teacher,
  isEnrolled = true,
  onJoin,
  isJoining = false,
}) {
  const [selected, setSelected] = useState(null);
  const { classId } = useParams();
  const { user, authStatus } = useAuth();
  const isHydrating = authStatus === "hydrating";

  const { data: studentRows = [] } = useGetStudentGradebookQuery(
    { courseId: classId, studentId: user?.id },
    { skip: isHydrating || teacher || !user?.id || !isEnrolled }
  );

  const { data: teacherRows = [] } = useGetTeacherGradebookQuery(classId, {
    skip: isHydrating || !teacher || !classId || !isEnrolled,
  });

  const { data: summary } = useGetCourseAnalyticsSummaryQuery(classId, {
    skip: isHydrating || !teacher || !classId || !isEnrolled,
  });

  const rows = teacher ? teacherRows : studentRows;

  const metrics = useMemo(() => {
    if (teacher) {
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
  }, [teacher, summary, studentRows]);

  if (!isEnrolled) {
    return (
      <section className="mt-4">
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-text-heading">
            Gradebook is reserved for enrolled students
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-text-muted">
            Join this class to track your grades, missing assignments, and class standing.
          </p>
          {onJoin && (
            <Button onClick={onJoin} loading={isJoining} className="mt-4 gap-2 rounded-xl">
              <UserPlus className="h-4 w-4" />
              <span>Join Class</span>
            </Button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-4 space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-primary">
          Academic Progress
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-text-heading">
          Grades & Performance
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          {teacher
            ? "Track class standing, review scores, and monitor submission trends."
            : "Review your submitted work, scores, and instructor feedback."}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {metrics.map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl bg-surface p-5 shadow-xs ring-1 ring-border"
          >
            <p className="text-xs font-medium text-text-muted">{label}</p>
            <p className="mt-1.5 text-2xl font-bold tracking-tight text-text-heading">
              {value}
            </p>
          </div>
        ))}
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No grades available yet"
          description="Grades will appear here as coursework is completed and reviewed."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-surface ring-1 ring-border shadow-xs">
          <table className="w-full min-w-155 text-left text-sm">
            <thead className="border-b border-border bg-canvas/60 text-xs font-semibold text-text-muted uppercase tracking-wider">
              <tr>
                {teacher ? (
                  <>
                    <th className="px-5 py-3.5">Student</th>
                    <th className="px-5 py-3.5">Average</th>
                    <th className="px-5 py-3.5">Missing</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </>
                ) : (
                  <>
                    <th className="px-5 py-3.5">Assignment</th>
                    <th className="px-5 py-3.5">Due date</th>
                    <th className="px-5 py-3.5">Score</th>
                    <th className="px-5 py-3.5 text-right">Status</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {teacher
                ? rows.map((row) => (
                    <Fragment key={row.id}>
                      <tr className="hover:bg-canvas/40 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <ClassroomAvatar
                              name={row.studentName}
                              avatar={row.avatar}
                              size="h-8 w-8"
                            />
                            <span className="font-medium text-text-heading">
                              {row.studentName}
                            </span>
                          </div>
                        </td>
                        <td
                          className={`px-5 py-3.5 font-semibold ${
                            row.average === "—"
                              ? "text-text-muted"
                              : "text-text-main"
                          }`}
                        >
                          {row.average}
                        </td>
                        <td className="px-5 py-3.5 text-text-muted">
                          {row.missingCount || "—"}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setSelected(selected === row.id ? null : row.id)
                            }
                            className="rounded-lg text-xs font-medium text-primary hover:text-primary"
                          >
                            {selected === row.id ? "Hide details" : "View breakdown"}
                          </Button>
                        </td>
                      </tr>
                      {selected === row.id && (
                        <tr key={`${row.id}-detail`}>
                          <td
                            colSpan="4"
                            className="bg-canvas/50 px-5 py-3.5 text-xs text-text-muted leading-relaxed"
                          >
                            Breakdown for <strong className="text-text-heading">{row.studentName}</strong>: {row.submittedCount ?? 0} assignments submitted · {row.missingCount ?? 0} missing.
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))
                : rows.map((row) => (
                    <tr key={row.id} className="hover:bg-canvas/40 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-text-heading">
                        {row.assignmentTitle}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-text-muted">
                        {row.dueDate}
                      </td>
                      <td
                        className={`px-5 py-3.5 font-semibold ${
                          row.score === null
                            ? "text-text-muted"
                            : "text-text-main"
                        }`}
                      >
                        {row.score === null ? "—" : `${row.score}/${row.outOf}`}
                      </td>
                      <td className="px-5 py-3.5 text-right">
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
