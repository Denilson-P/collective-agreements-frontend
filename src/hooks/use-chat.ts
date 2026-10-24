
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { sendChatMessage } from "@/services/chat-service";
import type { ChatMessage } from "@/types/chat";

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (question: string) => Promise<void>;
  newConversation: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const isRequestPendingRef = useRef(false);

  const sendMessage = useCallback(async (question: string): Promise<void> => {
    const normalizedQuestion = question.trim();

    if (!normalizedQuestion || isRequestPendingRef.current) {
      return;
    }

    isRequestPendingRef.current = true;
    const requestId = ++requestIdRef.current;
    const controller = new AbortController();

    abortControllerRef.current = controller;

    setError(null);
    setIsLoading(true);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: normalizedQuestion,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    try {
      const response = await sendChatMessage(
        { question: normalizedQuestion },
        controller.signal,
      );

      if (requestId !== requestIdRef.current) {
        return;
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.answer,
        sources: response.sources,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        assistantMessage,
      ]);
    } catch (caughtError) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      if (
        caughtError instanceof Error &&
        caughtError.name === "AbortError"
      ) {
        return;
      }

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Ocorreu um erro inesperado ao enviar a pergunta.",
      );
    } finally {
      if (requestId === requestIdRef.current) {
        isRequestPendingRef.current = false;
        abortControllerRef.current = null;
        setIsLoading(false);
      }
    }
  }, []);

  const newConversation = useCallback(() => {
    requestIdRef.current += 1;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    isRequestPendingRef.current = false;

    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      requestIdRef.current += 1;
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    newConversation,
  };
}
