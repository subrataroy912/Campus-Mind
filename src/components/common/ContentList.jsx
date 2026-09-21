import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export function ContentList({
  items = [],
  renderItem,
  limit,
  layout = "carousel",
  keyExtractor = (item, index) => item?.id || index,
  customItemClass = "",
  hasParentCarousel = false,
}) {
  const displayItems = limit ? items.slice(0, limit) : items;

  if (!displayItems.length) return null;

  if (layout === "carousel") {
    const carouselInner = (
      <CarouselContent className="-ml-3 sm:-ml-3.5 items-stretch">
        {displayItems.map((item, index) => (
          <CarouselItem
            key={keyExtractor(item, index)}
            className="basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 max-w-[320px] pl-3 sm:pl-3.5"
          >
            <div
              className={cn("flex h-full w-full flex-col", customItemClass)}
            >
              {renderItem(item, index)}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    );

    if (hasParentCarousel) {
      return <div className="relative w-full min-w-0">{carouselInner}</div>;
    }

    return (
      <div className="relative w-full min-w-0">
        <Carousel
          opts={{
            align: "start",
            dragFree: true,
          }}
          className="w-full min-w-0"
        >
          {carouselInner}

          {/* Compact navigation buttons when used standalone */}
          <div className="hidden sm:block">
            <CarouselPrevious className="-left-3 h-7 w-7 border-border/80 bg-background/90 shadow-xs hover:bg-background lg:-left-3.5" />
            <CarouselNext className="-right-3 h-7 w-7 border-border/80 bg-background/90 shadow-xs hover:bg-background lg:-right-3.5" />
          </div>
        </Carousel>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {displayItems.map((item, index) => (
        <div
          key={keyExtractor(item, index)}
          className={cn("flex h-full w-full flex-col", customItemClass)}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
