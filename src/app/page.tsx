
"use client";

import { useState } from "react";

type Theme = "light" | "dark";

export default function Home() {
  const [theme, setTheme] = useState<Theme>("dark");
  const isDark = theme === "dark";

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
          className="secondary-button w-full rounded-xl px-4 py-3 text-left text-sm font-medium"
        >
          + Nova conversa
        </button>

        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Sessão
          </h2>

          <div className="surface-card mt-3 rounded-xl p-4">
            <p className="text-xs text-muted">Consultas realizadas</p>
            <p className="mt-1 text-2xl font-semibold">0</p>
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

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">
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
        </div>

        <footer className="px-6 pb-6 pt-3">
          <div className="mx-auto max-w-4xl">
            <div className="surface-card flex items-end gap-3 rounded-2xl p-3">
              <textarea
                aria-label="Pergunta sobre convenções coletivas"
                placeholder="Digite sua pergunta..."
                rows={2}
                className="min-h-14 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted"
              />

              <button
                type="button"
                disabled
                className="send-button rounded-xl px-5 py-3 text-sm font-semibold"
              >
                Enviar
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-muted">
              As respostas serão fundamentadas nos documentos consultados.
            </p>
          </div>
        </footer>
      </section>
    </main>
  );
}
