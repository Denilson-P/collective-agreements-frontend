
"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";

interface ChatInputProps {
  onSubmit: (question: string) => void;
  disabled?: boolean;
}

export function ChatInput({
  onSubmit,
  disabled = false,
}: ChatInputProps) {
  const [question, setQuestion] = useState("");

  const canSubmit = question.trim().length > 0 && !disabled;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    onSubmit(question.trim());
    setQuestion("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="surface-card flex items-end gap-3 rounded-2xl p-3">
        <textarea
          aria-label="Pergunta sobre convenções coletivas"
          placeholder="Digite sua pergunta..."
          rows={2}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="min-h-14 min-w-0 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted"
        />

        <button
          type="submit"
          disabled={!canSubmit}
          className="send-button rounded-xl px-5 py-3 text-sm font-semibold"
        >
          Enviar
        </button>
      </div>
    </form>
  );
}
