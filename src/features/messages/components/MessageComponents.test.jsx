import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { MessageRoleBadge } from "./MessageRoleBadge.jsx";
import { MessageContent } from "./MessageContent.jsx";
import { MessageReactionPicker } from "./MessageReactionPicker.jsx";
import { MessageReactions } from "./MessageReactions.jsx";
import { MessageImagePreview } from "./MessageImagePreview.jsx";
import { MessageAttachmentDrawer } from "./MessageAttachmentDrawer.jsx";
import { MessageLightbox } from "./MessageLightbox.jsx";
import { MessagePresenceMemberItem } from "./MessagePresenceMemberItem.jsx";
import { MessageRoomItem } from "./MessageRoomItem.jsx";

vi.mock("react-router", () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

describe("Message Components", () => {
  describe("MessageRoleBadge", () => {
    it("renders Owner badge when role is OWNER", () => {
      const html = renderToString(<MessageRoleBadge role="OWNER" />);
      expect(html).toContain("Owner");
    });

    it("renders Admin badge when role is ADMIN", () => {
      const html = renderToString(<MessageRoleBadge role="admin" />);
      expect(html).toContain("Admin");
    });

    it("renders nothing when role is regular MEMBER or undefined", () => {
      const html = renderToString(<MessageRoleBadge role="MEMBER" />);
      expect(html).toBe("");
    });
  });

  describe("MessageContent", () => {
    it("renders normal text paragraphs", () => {
      const html = renderToString(
        <MessageContent content="Hello team!\n\nWelcome to the space." />,
      );
      expect(html).toContain("Hello team!");
      expect(html).toContain("Welcome to the space.");
    });

    it("renders read more button for very long content", () => {
      const longText = "A".repeat(400);
      const html = renderToString(<MessageContent content={longText} />);
      expect(html).toContain("Read more");
    });
  });

  describe("MessageReactionPicker", () => {
    it("renders emoji list with accessible role and labels", () => {
      const html = renderToString(
        <MessageReactionPicker onSelectEmoji={vi.fn()} isMine={false} />,
      );
      expect(html).toContain('role="dialog"');
      expect(html).toContain('aria-label="Reaction picker"');
      expect(html).toContain("👍");
      expect(html).toContain("❤️");
      expect(html).toContain("🚀");
    });
  });

  describe("MessageReactions", () => {
    it("renders reaction pills with user counts", () => {
      const reactions = {
        "👍": ["u1", "u2"],
        "🚀": ["u3"],
      };
      const html = renderToString(
        <MessageReactions
          reactions={reactions}
          currentUserId="u1"
          onToggleReaction={vi.fn()}
        />
      );
      expect(html).toContain("👍");
      expect(html).toContain("2");
      expect(html).toContain("🚀");
      expect(html).toContain("1");
      // Current user reacted with thumbs up, so primary highlight applied
      expect(html).toContain("border-primary/40");
    });

    it("returns null if reactions map is empty or undefined", () => {
      const html = renderToString(
        <MessageReactions reactions={{}} currentUserId="u1" />,
      );
      expect(html).toBe("");
    });
  });

  describe("MessageImagePreview", () => {
    it("renders preview image and file metadata", () => {
      const file = { name: "diagram.png", size: 1024 * 50 };
      const html = renderToString(
        <MessageImagePreview
          preview="data:image/png;base64,sample"
          file={file}
          error={null}
          isUploading={false}
          onClear={vi.fn()}
        />
      );
      expect(html).toContain("diagram.png");
      expect(html).toContain("Ready to send");
      expect(html).toContain('aria-label="Remove selected image"');
    });

    it("renders error message if error is passed", () => {
      const html = renderToString(
        <MessageImagePreview
          preview={null}
          file={null}
          error="File size too large"
          isUploading={false}
          onClear={vi.fn()}
        />
      );
      expect(html).toContain("File size too large");
    });
  });

  describe("MessageAttachmentDrawer", () => {
    it("renders url and label inputs when open", () => {
      const html = renderToString(
        <MessageAttachmentDrawer
          isOpen={true}
          url="https://example.com/spec"
          name="Design Spec"
          onUrlChange={vi.fn()}
          onNameChange={vi.fn()}
          onClose={vi.fn()}
        />
      );
      expect(html).toContain('value="https://example.com/spec"');
      expect(html).toContain('value="Design Spec"');
    });

    it("renders null when closed", () => {
      const html = renderToString(
        <MessageAttachmentDrawer
          isOpen={false}
          url=""
          name=""
          onUrlChange={vi.fn()}
          onNameChange={vi.fn()}
          onClose={vi.fn()}
        />
      );
      expect(html).toBe("");
    });
  });

  describe("MessagePresenceMemberItem", () => {
    it("renders online user with online now text and (You) indicator", () => {
      const member = {
        userId: "u123",
        name: "Alice",
        role: "OWNER",
        online: true,
      };
      const html = renderToString(
        <MessagePresenceMemberItem
          member={member}
          isCurrentUser={true}
          isOnline={true}
        />
      );
      expect(html).toContain("Alice");
      expect(html).toContain("(You)");
      expect(html).toContain("Online now");
      expect(html).toContain("Owner");
    });

    it("renders offline user without (You) indicator", () => {
      const member = {
        userId: "u456",
        name: "Bob",
        role: "MEMBER",
        online: false,
        lastActiveAt: new Date(Date.now() - 3600000).toISOString(),
      };
      const html = renderToString(
        <MessagePresenceMemberItem
          member={member}
          isCurrentUser={false}
          isOnline={false}
        />
      );
      expect(html).toContain("Bob");
      expect(html).not.toContain("(You)");
    });
  });

  describe("MessageRoomItem", () => {
    it("renders channel title, last message preview, and unread badge", () => {
      const room = {
        spaceId: "space-1",
        title: "Algorithms & Data Structures",
        subtitle: "CS 201",
        unreadCount: 5,
        onlineCount: 3,
        lastMessageText: "Next assignment is posted!",
        lastMessageSender: "Prof. Oak",
      };
      const html = renderToString(
        <MessageRoomItem room={room} active={false} onSelect={vi.fn()} />,
      );
      expect(html).toContain("Algorithms &amp; Data Structures");
      expect(html).toContain("CS 201");
      expect(html).toContain("Prof. Oak: Next assignment is posted!");
      expect(html).toContain("3 online");
      expect(html).toContain("5");
    });
  });
});
