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
      className={`relative inline-flex max-w-full px-2 py-1 transition-opacity hover:opacity-80 ${className}`}
    >
      <div className="flex items-center justify-center gap-1 md:gap-2 flex-nowrap">
        <img
          src="/logo-square.webp"
          alt="CampusMind"
          width="40"
          height="40"
          decoding="async"
          fetchPriority={fetchPriority}
          className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
        />

        {!compact && (
          <span className="hidden whitespace-nowrap text-lg font-bold tracking-tight text-text-heading sm:inline sm:text-xl">
            Campus
            <span className="text-primary">Mind</span>
          </span>
        )}
      </div>

      <span className="absolute -right-3 -top-1 rounded bg-primary px-1 py-0.5 text-[9px] font-extrabold uppercase leading-none text-primary-foreground shadow-sm">
        beta
      </span>
    </Link>
  );
}

export default BrandLogo;
