import { EXPLORE_BANNERS, EXPLORE_TABS } from "../model/exploreConstants.js";

export default function ExploreHeroBanner({ tab = EXPLORE_TABS.CLASSES }) {
  const banner = EXPLORE_BANNERS[tab] || EXPLORE_BANNERS[EXPLORE_TABS.CLASSES];

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface shadow-xs">
      <div className="grid items-center gap-4 p-4 sm:grid-cols-[1.5fr_1fr]">
        <div>
          <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            {banner.badge}
          </span>
          <h2 className="mt-1 text-base font-bold text-text-heading sm:text-lg">
            {banner.title}
          </h2>
          <p className="mt-0.5 text-xs leading-relaxed text-text-muted">
            {banner.description}
          </p>
        </div>
        <div className="hidden sm:block overflow-hidden rounded-lg border border-border/60 bg-white p-1">
          <img
            src={banner.imageSrc}
            alt={banner.imageAlt}
            className="h-24 w-full rounded-md object-cover"
          />
        </div>
      </div>
    </div>
  );
}
