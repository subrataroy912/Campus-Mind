import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/common/EmptyState.jsx";
import { ContentList } from "@/components/common/ContentList.jsx";
import {
  Carousel,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function DashboardSection({
  id,
  title,
  description,
  layout = "carousel",
  icon: Icon,
  iconWrapperClass = "bg-primary/10 text-primary",
  linkTo,
  linkText = "See all",
  status,
  items = [],
  renderItem,
  errorTitle = "We could not load the data",
  errorDescription = "Please check your connection or try again later.",
  emptyTitle = "No items available",
  emptyDescription = "There are currently no items to display.",
  className,
}) {
  const isCarousel =
    layout === "carousel" && items.length > 0 && status !== "error";

  const sectionContent = (
    <section
      className={cn("flex flex-col gap-2.5 min-w-0 w-full", className)}
      aria-labelledby={id}
    >
      {/* Header Row */}
      <div className="flex flex-col justify-between gap-1.5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 min-w-0">
          {Icon && (
            <div
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                iconWrapperClass,
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
          )}
          <div className="space-y-0.5 min-w-0">
            <h2
              id={id}
              className="text-sm font-semibold tracking-tight text-foreground truncate"
            >
              {title}
            </h2>
            {description && (
              <p className="text-[11px] leading-none text-muted-foreground truncate">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {linkTo && (
            <Link
              to={linkTo}
              className="group inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <span>{linkText}</span>
              <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          )}

          {isCarousel && (
            <div className="hidden sm:flex items-center gap-1">
              <CarouselPrevious className="static h-6 w-6 translate-y-0 rounded-md border-border/80 bg-background/90 hover:bg-background" />
              <CarouselNext className="static h-6 w-6 translate-y-0 rounded-md border-border/80 bg-background/90 hover:bg-background" />
            </div>
          )}
        </div>
      </div>

      {/* Content Body */}
      {status === "error" ? (
        <div className="py-2">
          <EmptyState title={errorTitle} description={errorDescription} />
        </div>
      ) : items.length > 0 ? (
        <ContentList
          layout={layout}
          items={items}
          renderItem={renderItem}
          hasParentCarousel={isCarousel}
        />
      ) : (
        <div className="py-2">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      )}
    </section>
  );

  if (isCarousel) {
    return (
      <Carousel
        opts={{
          align: "start",
          dragFree: true,
        }}
        className="w-full min-w-0"
      >
        {sectionContent}
      </Carousel>
    );
  }

  return sectionContent;
}
