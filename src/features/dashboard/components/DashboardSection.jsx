import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/common/EmptyState.jsx";
import { ContentList } from "@/components/common/ContentList.jsx";

export function DashboardSection({
  id, // Unique ID for ARIA labeling
  title,
  description,
  layout = "carousel",
  icon: Icon,
  iconWrapperClass = "bg-primary/10 text-primary",
  linkTo,
  linkText = "See all",
  status, // "error", "loading", "success", etc.
  items = [],
  renderItem,
  errorTitle = "We could not load the data",
  errorDescription = "Please check your connection or try again later.",
  emptyTitle = "No items available",
  emptyDescription = "There are currently no items to display.",
  className, // Allow overriding outermost wrapper classes
}) {
  return (
    <section
      className={cn("mt-6 pt-5 sm:mt-8 sm:pt-6", className)}
      aria-labelledby={id}
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div className="flex items-start gap-2.5">
          {Icon && (
            <div
              className={cn(
                "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                iconWrapperClass
              )}
            >
              <Icon size={15} aria-hidden="true" />
            </div>
          )}
          <div>
            <h2
              id={id}
              className="text-base font-bold tracking-tight text-foreground sm:text-lg"
            >
              {title}
            </h2>
            {description && (
              <p className="text-[12px] text-muted-foreground">{description}</p>
            )}
          </div>
        </div>

        {linkTo && (
          <Link
            to={linkTo}
            className="inline-flex items-center gap-1 text-xs font-semibold text-foreground transition-colors hover:text-primary"
          >
            <span>{linkText}</span>
            <ArrowRight size={13} />
          </Link>
        )}
      </div>

      {status === "error" ? (
        <div className="mt-6">
          <EmptyState title={errorTitle} description={errorDescription} />
        </div>
      ) : items.length > 0 ? (
        <div className="mt-4">
          <ContentList layout={layout} items={items} renderItem={renderItem} />
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      )}
    </section>
  );
}
