
import type {
  BatchDocumentUploadResponse,
  DocumentUploadResponse,
} from "@/types/document";

const DOCUMENT_UPLOAD_ENDPOINT = "/api/documents/upload";
const BATCH_DOCUMENT_UPLOAD_ENDPOINT = "/api/documents/upload/batch";

export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
export const MAX_BATCH_DOCUMENTS = 50;

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

function validateDocument(file: File): void {
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

  if (
    !ALLOWED_DOCUMENT_EXTENSIONS.includes(
      extension as (typeof ALLOWED_DOCUMENT_EXTENSIONS)[number],
    )
  ) {
    throw new DocumentServiceError(
      `Formato inválido em "${file.name}". Envie um arquivo TXT, PDF, DOCX ou DOC.`,
    );
  }

  if (file.size === 0) {
    throw new DocumentServiceError(
      `O documento "${file.name}" está vazio.`,
    );
  }

  if (file.size > MAX_DOCUMENT_SIZE) {
    throw new DocumentServiceError(
      `O documento "${file.name}" excede o limite de 10 MB.`,
    );
  }
}

async function sendUploadRequest(
  endpoint: string,
  formData: FormData,
  signal?: AbortSignal,
): Promise<unknown> {
  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      body: formData,
      signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }

    throw new DocumentServiceError(
      "Não foi possível conectar ao servidor para enviar os documentos.",
    );
  }

  if (!response.ok) {
    const errorMessages: Record<number, string> = {
      400: "Os documentos enviados são inválidos ou não contêm texto utilizável.",
      409: "Já existe um documento com esse nome.",
      413: "Um dos documentos excede o limite permitido de 10 MB.",
      422: "Não foi possível validar os arquivos enviados.",
      503: "O serviço de documentos está temporariamente indisponível.",
    };

    throw new DocumentServiceError(
      errorMessages[response.status] ??
        "Ocorreu um erro ao processar os documentos.",
      response.status,
    );
  }

  try {
    return await response.json();
  } catch {
    throw new DocumentServiceError(
      "Não foi possível interpretar a resposta do servidor.",
    );
  }
}

export async function uploadDocument(
  file: File,
  signal?: AbortSignal,
): Promise<DocumentUploadResponse> {
  validateDocument(file);

  const formData = new FormData();
  formData.append("file", file);

  const data = await sendUploadRequest(
    DOCUMENT_UPLOAD_ENDPOINT,
    formData,
    signal,
  );

  if (!isDocumentUploadResponse(data)) {
    throw new DocumentServiceError(
      "O servidor retornou uma resposta em formato inesperado.",
    );
  }

  return data;
}

export async function uploadDocuments(
  files: File[],
  signal?: AbortSignal,
): Promise<BatchDocumentUploadResponse> {
  if (files.length < 1 || files.length > MAX_BATCH_DOCUMENTS) {
    throw new DocumentServiceError(
      `Selecione entre 1 e ${MAX_BATCH_DOCUMENTS} documentos.`,
    );
  }

  for (const file of files) {
    validateDocument(file);
  }

  const formData = new FormData();

  for (const file of files) {
    formData.append("files", file);
  }

  const data = await sendUploadRequest(
    BATCH_DOCUMENT_UPLOAD_ENDPOINT,
    formData,
    signal,
  );

  if (!isBatchDocumentUploadResponse(data)) {
    throw new DocumentServiceError(
      "O servidor retornou uma resposta de upload múltiplo inválida.",
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

function isBatchDocumentUploadResponse(
  value: unknown,
): value is BatchDocumentUploadResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const data = value as Record<string, unknown>;

  if (
    typeof data.total !== "number" ||
    !Number.isInteger(data.total) ||
    data.total < 1 ||
    data.total > MAX_BATCH_DOCUMENTS ||
    typeof data.indexed !== "number" ||
    !Number.isInteger(data.indexed) ||
    data.indexed < 0 ||
    typeof data.failed !== "number" ||
    !Number.isInteger(data.failed) ||
    data.failed < 0 ||
    !Array.isArray(data.results) ||
    data.results.length !== data.total ||
    data.indexed + data.failed !== data.total
  ) {
    return false;
  }

  let indexedCount = 0;
  let failedCount = 0;

  for (const result of data.results) {
    if (typeof result !== "object" || result === null) {
      return false;
    }

    const item = result as Record<string, unknown>;

    if (
      typeof item.filename !== "string" ||
      item.filename.length === 0
    ) {
      return false;
    }

    if (item.status === "indexed") {
      if (
        typeof item.chunks_created !== "number" ||
        !Number.isInteger(item.chunks_created) ||
        item.chunks_created < 1 ||
        item.error !== null
      ) {
        return false;
      }

      indexedCount += 1;
    } else if (item.status === "failed") {
      if (
        item.chunks_created !== null ||
        typeof item.error !== "string" ||
        item.error.length === 0
      ) {
        return false;
      }

      failedCount += 1;
    } else {
      return false;
    }
  }

  return (
    indexedCount === data.indexed &&
    failedCount === data.failed
  );
}
