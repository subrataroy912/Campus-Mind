
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
      ? "flex gap-4 overflow-x-auto overscroll-x-contain pb-3 scrollbar-thin scroll-smooth snap-x snap-mandatory"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6";

  const defaultItemClass =
    layout === "carousel"
      ? "w-[calc(100vw-2rem)] max-w-70 shrink-0 snap-start sm:w-[320px] sm:max-w-none"
      : "w-full h-full";

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
