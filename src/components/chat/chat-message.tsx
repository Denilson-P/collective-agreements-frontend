
import type { ChatMessage as ChatMessageType } from "@/types/chat";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <article
      className={`flex w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[85%] rounded-2xl p-4 sm:max-w-[75%] ${
          isUser ? "user-message" : "assistant-message"
        }`}
      >
        <p className="mb-2 text-xs font-semibold">
          {isUser ? "Você" : "Assistente"}
        </p>

        <p className="whitespace-pre-wrap wrap-break-word text-sm leading-7">
          {message.content}
        </p>

        {!isUser && message.sources && message.sources.length > 0 && (
          <section
            className="message-sources mt-4 border-t pt-3"
            aria-label="Fontes documentais"
          >
            <h3 className="mb-3 text-xs font-semibold">
              Fontes consultadas
            </h3>

            <div className="space-y-3">
              {message.sources.map((source, index) => (
                <div
                  key={`${source.reference}-${index}`}
                  className="source-card rounded-lg p-3"
                >
                  <p className="text-xs font-semibold">
                    [{source.reference}] {source.source}
                  </p>

                  <p className="mt-2 whitespace-pre-wrap wrap-break-word text-xs leading-6 text-muted">
                    {source.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
