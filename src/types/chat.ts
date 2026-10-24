
export type ChatRole = "user" | "assistant";

export interface ChatSource {
  reference: number;
  source: string;
  excerpt: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  sources?: ChatSource[];
}
