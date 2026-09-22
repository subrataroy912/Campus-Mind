import { useNavigate } from "react-router";
import { useState } from "react";

function NavbarSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="hidden md:flex items-center gap-2 rounded-md border border-border/60 bg-muted/40 px-2 py-1 transition-colors hover:border-border hover:bg-muted/70 focus-within:border-border focus-within:bg-muted/70 focus-within:ring-1 focus-within:ring-ring ml-2"
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search spaces, topics..."
        aria-label="Search spaces and topics"
        className="flex-1 min-w-[150px] bg-transparent text-[11px] text-foreground outline-none placeholder:text-muted-foreground"
      />

      <kbd className="pointer-events-none inline-flex h-4 items-center rounded border border-border/70 bg-background px-1 text-[9px] font-mono font-medium text-muted-foreground shadow-2xs">
        ⌘K
      </kbd>
    </form>
  );
}

export default NavbarSearch;
