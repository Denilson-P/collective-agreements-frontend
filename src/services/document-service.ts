
import type { DocumentUploadResponse } from "@/types/document";

const DOCUMENT_UPLOAD_ENDPOINT = "/api/documents/upload";

export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;

export const ALLOWED_DOCUMENT_EXTENSIONS = [
  ".txt",
  ".pdf",
  ".docx",
  ".doc",
] as const;

export class DocumentServiceError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "DocumentServiceError";
  }
}

export async function uploadDocument(
  file: File,
  signal?: AbortSignal,
): Promise<DocumentUploadResponse> {
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

  if (!ALLOWED_DOCUMENT_EXTENSIONS.includes(
    extension as (typeof ALLOWED_DOCUMENT_EXTENSIONS)[number],
  )) {
    throw new DocumentServiceError(
      "Formato inválido. Envie um arquivo TXT, PDF, DOCX ou DOC.",
    );
  }

  if (file.size === 0) {
    throw new DocumentServiceError(
      "O documento selecionado está vazio.",
    );
  }

  if (file.size > MAX_DOCUMENT_SIZE) {
    throw new DocumentServiceError(
      "O documento excede o limite de 10 MB.",
    );
  }

  const formData = new FormData();
  formData.append("file", file);

  let response: Response;

  try {
    response = await fetch(DOCUMENT_UPLOAD_ENDPOINT, {
      method: "POST",
      body: formData,
      signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }

    throw new DocumentServiceError(
      "Não foi possível conectar ao servidor para enviar o documento.",
    );
  }

  if (!response.ok) {
    const errorMessages: Record<number, string> = {
      400: "O documento enviado é inválido ou não contém texto utilizável.",
      409: "Já existe um documento com esse nome.",
      413: "O documento excede o limite permitido de 10 MB.",
      422: "Não foi possível validar o arquivo enviado.",
      503: "O serviço de documentos está temporariamente indisponível.",
    };

    throw new DocumentServiceError(
      errorMessages[response.status] ??
        "Ocorreu um erro ao processar o documento.",
      response.status,
    );
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new DocumentServiceError(
      "Não foi possível interpretar a resposta do servidor.",
    );
  }

  if (!isDocumentUploadResponse(data)) {
    throw new DocumentServiceError(
      "O servidor retornou uma resposta em formato inesperado.",
    );
  }

  return data;
}

function isDocumentUploadResponse(
  value: unknown,
): value is DocumentUploadResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const data = value as Record<string, unknown>;

  return (
    typeof data.filename === "string" &&
    data.filename.length > 0 &&
    data.status === "indexed" &&
    Number.isInteger(data.chunks_created) &&
    typeof data.chunks_created === "number" &&
    data.chunks_created > 0
  );
}
