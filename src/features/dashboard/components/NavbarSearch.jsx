import { useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import { Search, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";

// ------------------------------------------------------------------
//  MOCK DATA
// -----------------------------------------------------------------
const MOCK_RECOMMENDATIONS = [
  "Introduction to Web Architectures",
  "Advanced Frontend Frameworks",
  "Principles of Human-Computer Interaction",
  "TypeScript & Static Type Systems",
  "Component-Driven User Interface Design",
  "Full-Stack Systems Engineering",
  "Digital Animation & Motion Theory",
];

// ------------------------------------------------------------------
//  CUSTOM HOOK: Reusable click-outside logic
// ------------------------------------------------------------------
function useClickOutside(ref, handler) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, handler]);
}

// ------------------------------------------------------------------
//  UI COMPONENT: Suggestions Dropdown
// ------------------------------------------------------------------
function SearchSuggestions({ suggestions, query, onSelect, isVisible }) {
  if (!isVisible || query.trim() === "") return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 w-full bg-background border border-border/60 rounded-md shadow-lg overflow-hidden z-[60]">
      <ul className="max-h-[250px] overflow-y-auto py-1">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <li key={index}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onSelect(suggestion)}
                className="w-full justify-start rounded-none text-left px-3 py-2 h-auto text-sm text-foreground hover:bg-muted/60 flex items-center gap-2 transition-colors"
              >
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                {suggestion}
              </Button>
            </li>
          ))
        ) : (
          <li className="px-3 py-4 text-sm text-center text-muted-foreground">
            No results found for "{query}"
          </li>
        )}
      </ul>
    </div>
  );
}

// ------------------------------------------------------------------
//  MAIN COMPONENT: State & Layout Management
// ------------------------------------------------------------------
function NavbarSearch() {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [query, setQuery] = useState("");
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // custom hook to close suggestions
  useClickOutside(searchRef, () => setShowSuggestions(false));

  // Derived state for filtering
  const filteredSuggestions = MOCK_RECOMMENDATIONS.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase()),
  );

  const executeSearch = (searchQuery) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    setIsMobileExpanded(false);
    setShowSuggestions(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    executeSearch(query);
  };

  const handleSuggestionSelect = (suggestion) => {
    setQuery(suggestion);
    executeSearch(suggestion);
  };

  return (
    <div
      ref={searchRef}
      className="relative flex items-center justify-end md:justify-start"
    >
      {/* =========================================================
        MOBILE SEARCH TRIGGER
    ========================================================= */}
      {!isMobileExpanded && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileExpanded(true)}
          aria-label="Open search"
          className="md:hidden h-9 w-9 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 transition-all duration-200"
        >
          <Search className="h-[18px] w-[18px]" />
        </Button>
      )}

      {/* =========================================================
        SEARCH WRAPPER
    ========================================================= */}
      <div
        className={`
        ${isMobileExpanded ? "fixed inset-x-3 top-2 z-[100]" : "hidden"}

        md:relative
        md:inset-auto
        md:z-auto
        md:block

        w-auto md:w-full
      `}
      >
        {/* Mobile backdrop */}
        {isMobileExpanded && (
          <div
            className="
            fixed inset-0
            -z-10
            bg-background/70
            backdrop-blur-sm
            md:hidden
          "
          />
        )}

        {/* =======================================================
          SEARCH FORM
      ======================================================= */}
        <form
          onSubmit={handleFormSubmit}
          className="
          group
          flex items-center
          w-full

          h-10 md:h-9
          gap-2

          rounded-xl md:rounded-lg

          border border-border/70
          bg-background/95
          md:bg-muted/40

          px-3

          shadow-sm
          md:shadow-none

          transition-all duration-200

          hover:border-border
          hover:bg-muted/60

          focus-within:border-ring
          focus-within:bg-background
          focus-within:ring-2
          focus-within:ring-ring/20

          md:w-[240px]
          lg:w-[320px]
          xl:w-[400px]
          2xl:w-[440px]
        "
        >
          {/* Search icon */}
          <Search
            className="
            h-4 w-4
            shrink-0
            text-muted-foreground
            transition-colors
            group-focus-within:text-foreground
          "
          />

          {/* =====================================================
            INPUT
        ===================================================== */}
          <Input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search spaces, topics..."
            autoFocus={isMobileExpanded}
            className="min-w-0 flex-1 h-auto border-0 bg-transparent px-0 py-0 shadow-none outline-none focus-visible:ring-0 text-sm text-foreground placeholder:text-muted-foreground/80 selection:bg-primary/20 dark:bg-transparent [&::-webkit-search-cancel-button]:hidden"
          />

          {/* =====================================================
            CLEAR BUTTON
        ===================================================== */}
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => {
                setQuery("");
                setShowSuggestions(true);
              }}
              aria-label="Clear search"
              className="shrink-0 h-6 w-6 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}

          {/* =====================================================
            KEYBOARD SHORTCUT
        ===================================================== */}
          <Kbd className="hidden lg:inline-flex h-5 shrink-0 items-center rounded-md border border-border/70 bg-background px-1.5 text-[10px] font-medium font-mono text-muted-foreground shadow-sm">
            Ctrl K
          </Kbd>

          {/* =====================================================
            MOBILE CLOSE
        ===================================================== */}
          {isMobileExpanded && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                setIsMobileExpanded(false);
                setShowSuggestions(false);
                setQuery("");
              }}
              aria-label="Close search"
              className="md:hidden shrink-0 h-7 w-7 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 transition-all"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </form>

        {/* =========================================================
          SEARCH SUGGESTIONS
      ========================================================= */}
        <div
          className="
          absolute
          left-0
          right-0
          top-full

          mt-2

          z-[110]
        "
        >
          <SearchSuggestions
            isVisible={showSuggestions}
            query={query}
            suggestions={filteredSuggestions}
            onSelect={handleSuggestionSelect}
          />
        </div>
      </div>
    </div>
  );
}

export default NavbarSearch;
