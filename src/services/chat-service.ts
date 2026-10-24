
import type { ChatRequest, ChatResponse } from "@/types/chat";

const CHAT_ENDPOINT = "/api/chat";

export class ChatServiceError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ChatServiceError";
  }
}

export async function sendChatMessage(
  request: ChatRequest,
  signal?: AbortSignal,
): Promise<ChatResponse> {
  let response: Response;

  try {
    response = await fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }

    throw new ChatServiceError(
      "Não foi possível conectar ao servidor. Tente novamente.",
    );
  }

  if (!response.ok) {
    const errorMessages: Record<number, string> = {
      400: "Não foi possível processar a pergunta enviada.",
      422: "A pergunta enviada contém dados inválidos.",
      503: "O serviço de consulta está temporariamente indisponível.",
    };

    throw new ChatServiceError(
      errorMessages[response.status] ??
        "Ocorreu um erro ao consultar os documentos.",
      response.status,
    );
  }

  try {
    const data: unknown = await response.json();

    if (!isChatResponse(data)) {
      throw new ChatServiceError(
        "O servidor retornou uma resposta em formato inesperado.",
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ChatServiceError) {
      throw error;
    }

    throw new ChatServiceError(
      "Não foi possível interpretar a resposta do servidor.",
    );
  }
}

function isChatResponse(value: unknown): value is ChatResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const data = value as Record<string, unknown>;

  return (
    typeof data.question === "string" &&
    typeof data.answer === "string" &&
    Array.isArray(data.sources) &&
    data.sources.every((source: unknown) => {
      if (typeof source !== "object" || source === null) {
        return false;
      }

      const item = source as Record<string, unknown>;

      return (
        Number.isInteger(item.reference) &&
        typeof item.source === "string" &&
        typeof item.excerpt === "string"
      );
    })
  );
}
