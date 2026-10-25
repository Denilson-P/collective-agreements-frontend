
"use client";

import { useRef, useState, type ChangeEvent } from "react";

import { useDocumentUpload } from "@/hooks/use-document-upload";

const ACCEPTED_FORMATS = ".txt,.pdf,.docx,.doc";

export function DocumentUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    isUploading,
    error,
    result,
    sendDocument,
    reset,
  } = useDocumentUpload();

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    reset();
    setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile || isUploading) {
      return;
    }

    await sendDocument(selectedFile);
  }

  function handleClear() {
    reset();
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <section aria-labelledby="document-upload-title">
      <h2
        id="document-upload-title"
        className="text-xs font-semibold uppercase tracking-wider text-muted"
      >
        Documentos
      </h2>

      <div className="surface-card mt-3 rounded-xl p-4">
        <p className="text-sm font-medium">
          Adicionar documento
        </p>

        <p className="mt-2 text-xs leading-5 text-muted">
          Envie uma convenção coletiva para disponibilizar seu conteúdo
          nas consultas.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_FORMATS}
          onChange={handleFileChange}
          disabled={isUploading}
          aria-label="Selecionar documento"
          className="mt-4 block w-full min-w-0 text-xs text-muted file:mr-2 file:rounded-lg file:border-0 file:bg-accent file:px-3 file:py-2 file:text-xs file:font-medium file:cursor-pointer"
        />

        <p className="mt-2 text-xs text-muted">
          TXT, PDF, DOCX ou DOC — até 10 MB.
        </p>

        {selectedFile && (
          <p className="mt-3 break-all text-xs">
            Selecionado: {selectedFile.name}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="send-button rounded-lg px-4 py-2 text-xs font-semibold"
          >
            {isUploading ? "Indexando..." : "Enviar documento"}
          </button>

          {selectedFile && !isUploading && (
            <button
              type="button"
              onClick={handleClear}
              className="secondary-button rounded-lg px-3 py-2 text-xs"
            >
              Limpar
            </button>
          )}
        </div>

        {isUploading && (
          <p role="status" className="mt-3 text-xs text-muted">
            Enviando e indexando documento. Aguarde...
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mt-3 break-words text-xs text-red-500"
          >
            {error}
          </p>
        )}

        {result && (
          <p
            role="status"
            className="mt-3 break-words text-xs"
          >
            Documento indexado com sucesso! {result.chunks_created}{" "}
            trechos disponíveis para consulta.
          </p>
        )}
      </div>
    </section>
  );
}
