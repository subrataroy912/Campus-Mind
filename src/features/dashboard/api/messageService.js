import { CONVERSATIONS } from "@/mock/mockMessages.js";

const delay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 300));

export async function fetchConversations() {
  return delay({
    conversations: CONVERSATIONS.map((conversation) => ({
      ...conversation,
      messages: conversation.messages.map((message) => ({ ...message })),
    })),
  });
}
