
export function ContentList({
  items = [],
  renderItem,
  limit,
  layout = "carousel",
  keyExtractor = (item) => item.id,
  customItemClass = "",
}) {
  const displayItems = limit ? items?.slice(0, limit) : items;

  if (!displayItems?.length) return null;

  const containerClass =
    layout === "carousel"
      ? "flex gap-4 overflow-x-auto overscroll-x-contain pb-3 scrollbar-thin scroll-smooth snap-x snap-mandatory items-stretch"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 items-stretch";

  const defaultItemClass =
    layout === "carousel"
      ? "w-[85vw] max-w-[320px] min-w-[260px] sm:w-[320px] sm:max-w-none shrink-0 snap-start flex flex-col h-full"
      : "w-full h-full flex flex-col";

  return (
    <div className={containerClass}>
      {displayItems.map((item, index) => (
        <div
          key={keyExtractor(item, index)}
          className={customItemClass || defaultItemClass}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

