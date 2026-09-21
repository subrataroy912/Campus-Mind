import { Link, useLocation } from "react-router";

function BrandLogo({
  compact = false,
  className = "",
  fetchPriority = "auto",
  to = "/",
}) {
  const location = useLocation();

  const handleClick = (e) => {
    if (location.pathname === to) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={`relative inline-flex items-center gap-1.5 max-w-full px-1 py-0.5 transition-opacity hover:opacity-85 ${className}`}
    >
      <div className="flex items-center justify-center gap-1.5 flex-nowrap">
        <img
          src="/logo-square.webp"
          alt="CampusMind"
          width="40"
          height="40"
          decoding="async"
          fetchPriority={fetchPriority}
          className="h-6 w-6 shrink-0 object-contain sm:h-7 sm:w-7 rounded-md"
        />

        {!compact && (
          <span className="hidden whitespace-nowrap text-xs sm:text-sm font-semibold tracking-tight text-foreground sm:inline">
            Campus<span className="text-primary font-bold">Mind</span>
          </span>
        )}
      </div>

      <span className="ml-1 rounded-[4px] bg-primary/10 border border-primary/20 px-1 py-0.2 text-[8px] font-bold uppercase tracking-wider text-primary">
        beta
      </span>
    </Link>
  );
}

export default BrandLogo;
