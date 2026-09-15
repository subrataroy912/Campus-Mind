import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function ContentList({
  items = [],
  renderItem,
  limit,
  layout = "carousel",
  keyExtractor = (item, index) => item?.id || index,
  customItemClass = "",
}) {
  const displayItems = limit ? items?.slice(0, limit) : items;

  if (!displayItems?.length) return null;

  if (layout === "carousel") {
    return (
      <div className="relative w-full cursor-pointer">
        <Carousel
          opts={{
            align: "start",
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 sm:-ml-6 items-stretch">
            {displayItems.map((item, index) => (
              <CarouselItem
                key={keyExtractor(item, index)}
                className="pl-4 sm:pl-6 basis-[85vw] min-w-65 max-w-[320px] sm:basis-[320px] sm:max-w-none"
              >
                <div
                  className={customItemClass || "flex h-full w-full flex-col"}
                >
                  {renderItem(item, index)}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="hidden md:block">
            <CarouselPrevious className="-left-4 lg:-left-12" />
            <CarouselNext className="-right-4 lg:-right-12" />
          </div>
        </Carousel>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-stretch gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {displayItems.map((item, index) => (
        <div
          key={keyExtractor(item, index)}
          className={customItemClass || "flex h-full w-full flex-col"}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
