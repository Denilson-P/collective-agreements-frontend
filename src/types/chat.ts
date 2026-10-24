
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

export interface ChatRequest {
  question: string;
  k?: number | null;
}

export interface ChatResponse {
  question: string;
  answer: string;
  sources: ChatSource[];
}
