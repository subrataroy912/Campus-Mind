import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { splitIntoReadableParagraphs } from "../utils/messageFormatters.js";
import {
  MESSAGE_COLLAPSE_CHAR_LIMIT,
  MESSAGE_COLLAPSE_LINE_LIMIT,
} from "../constants/messageConstants.js";

export function MessageContent({ content, isMine }) {
  const [expanded, setExpanded] = useState(false);

  const normalized = useMemo(
    () =>
      String(content || "")
        .replace(/\r\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim(),
    [content],
  );

  const lines = useMemo(() => normalized.split("\n"), [normalized]);
  const isLong =
    normalized.length > MESSAGE_COLLAPSE_CHAR_LIMIT ||
    lines.length > MESSAGE_COLLAPSE_LINE_LIMIT;

  const displayedText = useMemo(() => {
    if (!isLong || expanded) {
      return normalized;
    }
    let slice = normalized;
    if (lines.length > MESSAGE_COLLAPSE_LINE_LIMIT) {
      slice = lines.slice(0, MESSAGE_COLLAPSE_LINE_LIMIT).join("\n");
    }
    if (slice.length > MESSAGE_COLLAPSE_CHAR_LIMIT) {
      const cut = slice.slice(0, MESSAGE_COLLAPSE_CHAR_LIMIT);
      const lastSpace = cut.lastIndexOf(" ");
      slice = lastSpace > 180 ? cut.slice(0, lastSpace) : cut;
    }
    return `${slice.trimEnd()}…`;
  }, [normalized, lines, isLong, expanded]);

  const paragraphs = useMemo(
    () => splitIntoReadableParagraphs(displayedText),
    [displayedText],
  );

  return (
    <div>
      <div className="space-y-2 whitespace-pre-wrap break-words [overflow-wrap:anywhere] leading-relaxed">
        {paragraphs.map((para, idx) => (
          <p key={idx} className="whitespace-pre-wrap break-words">
            {para}
          </p>
        ))}
      </div>

      {isLong && (
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => setExpanded((prev) => !prev)}
          className={`mt-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold transition cursor-pointer h-auto ${
            isMine
              ? "bg-white/15 text-white hover:bg-white/25 hover:text-white"
              : "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
          }`}
        >
          {expanded ? (
            <>
              <span>Show less</span>
              <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              <span>Read more</span>
              <ChevronDown className="h-3 w-3" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}
