
"use client";

import { useRef, useState, type ChangeEvent } from "react";

import { useDocumentUpload } from "@/hooks/use-document-upload";
import {
  MAX_BATCH_DOCUMENTS,
  MAX_DOCUMENT_SIZE,
} from "@/services/document-service";

const ACCEPTED_FORMATS = ".txt,.pdf,.docx,.doc";

function getDocumentErrorMessage(error: string): string {
  const normalizedError = error.toLowerCase();

  const duplicateIndicators = [
    "already exists",
    "already uploaded",
    "duplicate",
    "duplicado",
    "duplicada",
    "já existe",
    "ja existe",
    "já cadastrado",
    "ja cadastrado",
  ];

  const isDuplicate = duplicateIndicators.some((indicator) =>
    normalizedError.includes(indicator),
  );

  if (isDuplicate) {
    return "Este documento já foi enviado anteriormente e está disponível para consulta.";
  }

  return error;
}

export function DocumentUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectionError, setSelectionError] = useState<string | null>(null);

  const {
    isUploading,
    error,
    batchResult,
    sendDocuments,
    reset,
  } = useDocumentUpload();

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    reset();
    setSelectionError(null);

    if (files.length > MAX_BATCH_DOCUMENTS) {
      setSelectedFiles([]);
      setSelectionError(
        `Selecione no máximo ${MAX_BATCH_DOCUMENTS} documentos por envio.`,
      );

      event.target.value = "";
      return;
    }

    const oversizedFile = files.find(
      (file) => file.size > MAX_DOCUMENT_SIZE,
    );

    if (oversizedFile) {
      setSelectedFiles([]);
      setSelectionError(
        `O documento "${oversizedFile.name}" excede o limite de 10 MB.`,
      );

      event.target.value = "";
      return;
    }

    setSelectedFiles(files);
  }

  async function handleUpload() {
    if (selectedFiles.length === 0 || isUploading) {
      return;
    }

    await sendDocuments(selectedFiles);
  }

  function handleClear() {
    reset();
    setSelectedFiles([]);
    setSelectionError(null);

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
          Adicionar documentos
        </p>

        <p className="mt-2 text-xs leading-5 text-muted">
          Envie convenções coletivas para disponibilizar seus conteúdos
          nas consultas.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_FORMATS}
          onChange={handleFileChange}
          disabled={isUploading}
          aria-label="Selecionar documentos"
          className="mt-4 block w-full min-w-0 text-xs text-muted file:mr-2 file:rounded-lg file:border-0 file:bg-accent file:px-3 file:py-2 file:text-xs file:font-medium file:cursor-pointer"
        />

        <p className="mt-2 text-xs text-muted">
          TXT, PDF, DOCX ou DOC — até 10 MB por arquivo.
          Máximo de {MAX_BATCH_DOCUMENTS} documentos por envio.
        </p>

        {selectedFiles.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium">
              {selectedFiles.length}{" "}
              {selectedFiles.length === 1
                ? "documento selecionado"
                : "documentos selecionados"}
            </p>

            <ul className="mt-2 max-h-36 space-y-1 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <li
                  key={`${file.name}-${file.size}-${index}`}
                  className="break-all text-xs text-muted"
                >
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || isUploading}
            className="send-button rounded-lg px-4 py-2 text-xs font-semibold"
          >
            {isUploading
              ? "Indexando..."
              : selectedFiles.length === 1
                ? "Enviar documento"
                : "Enviar documentos"}
          </button>

          {selectedFiles.length > 0 && !isUploading && (
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
            Enviando e indexando {selectedFiles.length}{" "}
            {selectedFiles.length === 1
              ? "documento"
              : "documentos"}
            . Aguarde...
          </p>
        )}

        {(selectionError || error) && (
          <p
            role="alert"
            className="mt-3 break-words text-xs text-red-500"
          >
            {selectionError || error}
          </p>
        )}

        {batchResult && (
          <div className="mt-4" role="status">
            <p className="text-xs font-semibold">
              Processamento concluído
            </p>

            <p className="mt-2 text-xs text-muted">
              {batchResult.total} documentos processados:{" "}
              {batchResult.indexed} indexados e{" "}
              {batchResult.failed} com falha.
            </p>

            <ul className="mt-3 max-h-56 space-y-2 overflow-y-auto">
              {batchResult.results.map((item, index) => (
                <li
                  key={`${item.filename}-${index}`}
                  className="rounded-lg border border-border p-2 text-xs"
                >
                  <p className="break-all font-medium">
                    {item.filename}
                  </p>

                  {item.status === "indexed" ? (
                    <p className="mt-1 text-green-600 dark:text-green-400">
                      Indexado com sucesso — {item.chunks_created}{" "}
                      {item.chunks_created === 1
                        ? "trecho"
                        : "trechos"}.
                    </p>
                  ) : (
                    <p className="mt-1 break-words text-red-500">
                      {getDocumentErrorMessage(item.error)}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
