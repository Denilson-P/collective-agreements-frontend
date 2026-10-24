
"use client";

import { useState } from "react";

import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessage } from "@/components/chat/chat-message";
import { useChat } from "@/hooks/use-chat";

type Theme = "light" | "dark";

export default function Home() {
  const [theme, setTheme] = useState<Theme>("dark");

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    newConversation,
  } = useChat();

  const isDark = theme === "dark";
  const hasMessages = messages.length > 0;

  return (
    <main
      data-theme={theme}
      className="app-shell flex min-h-screen flex-col md:h-screen md:flex-row"
    >
      <aside className="sidebar flex w-full shrink-0 flex-col border-b p-5 md:w-72 md:border-b-0 md:border-r">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
            Document Intelligence
          </p>

          <h1 className="mt-2 text-lg font-semibold tracking-tight">
            Collective Agreements
          </h1>

          <p className="mt-1 text-sm text-muted">
            AI-powered document search
          </p>
        </div>

        <button
          type="button"
          onClick={newConversation}
          className="secondary-button w-full rounded-xl px-4 py-3 text-left text-sm font-medium"
        >
          + Nova conversa
        </button>

        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Sessão
          </h2>

          <div className="surface-card mt-3 rounded-xl p-4">
            <p className="text-xs text-muted">
              Perguntas enviadas
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {messages.filter((message) => message.role === "user").length}
            </p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Recursos
          </h2>

          <div className="mt-3 space-y-3 text-sm text-muted">
            <p>Consulta de convenções coletivas</p>
            <p>Busca semântica</p>
            <p>Respostas com fontes documentais</p>
          </div>
        </section>

        <div className="mt-auto pt-8">
          <div className="surface-card rounded-xl p-3">
            <p className="mb-3 text-xs font-medium text-muted">
              Aparência
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                aria-pressed={!isDark}
                onClick={() => setTheme("light")}
                className={`theme-button flex-1 rounded-lg px-3 py-2 text-sm ${
                  !isDark ? "theme-button-active" : ""
                }`}
              >
                Claro
              </button>

              <button
                type="button"
                aria-pressed={isDark}
                onClick={() => setTheme("dark")}
                className={`theme-button flex-1 rounded-lg px-3 py-2 text-sm ${
                  isDark ? "theme-button-active" : ""
                }`}
              >
                Escuro
              </button>
            </div>
          </div>
        </div>
      </aside>

      <section className="flex min-h-[650px] min-w-0 flex-1 flex-col md:min-h-0">
        <header className="header-border border-b px-6 py-5">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-lg font-semibold">
              Consulta de Convenções Coletivas
            </h2>

            <p className="mt-1 text-sm text-muted">
              Explore obrigações, benefícios e informações dos documentos.
            </p>
          </div>
        </header>

        <div
          className={`flex min-h-0 flex-1 flex-col px-6 py-10 ${
            hasMessages
              ? "overflow-y-auto"
              : "items-center justify-center"
          }`}
        >
          {hasMessages ? (
            <div
              className="mx-auto flex w-full max-w-4xl flex-col gap-5"
              role="log"
              aria-label="Mensagens da conversa"
              aria-live="polite"
            >
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                />
              ))}

              {isLoading && (
                <div
                  role="status"
                  className="assistant-message w-fit max-w-[85%] rounded-2xl p-4 text-sm sm:max-w-[75%]"
                >
                  Consultando documentos e gerando resposta...
                </div>
              )}
            </div>
          ) : (
            <div className="w-full max-w-2xl text-center">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-2xl font-semibold">
                C
              </div>

              <h3 className="text-3xl font-semibold tracking-tight">
                Como posso ajudar?
              </h3>

              <p className="mx-auto mt-4 max-w-xl leading-7 text-muted">
                Faça perguntas sobre Convenções Coletivas de Trabalho e
                encontre informações fundamentadas nos documentos.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="surface-card rounded-xl p-4 text-left text-sm">
                  Quais são as obrigações relacionadas ao seguro de vida?
                </div>

                <div className="surface-card rounded-xl p-4 text-left text-sm">
                  Quais benefícios são previstos na convenção coletiva?
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="px-6 pb-6 pt-3">
          <div className="mx-auto max-w-4xl">
            {error && (
              <div
                role="alert"
                className="mb-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-500"
              >
                {error}
              </div>
            )}

            <ChatInput
              onSubmit={sendMessage}
              disabled={isLoading}
            />

            <p className="mt-3 text-center text-xs text-muted">
              As respostas são geradas com base nos documentos consultados.
            </p>
          </div>
        </footer>
      </section>
    </main>
  );
}
