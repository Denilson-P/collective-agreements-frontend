export interface DocumentUploadResponse {
  filename: string;
  status: "indexed";
  chunks_created: number;
}

export type BatchDocumentResult =
  | {
      filename: string;
      status: "indexed";
      chunks_created: number;
      error: null;
    }
  | {
      filename: string;
      status: "failed";
      chunks_created: null;
      error: string;
    };

export interface BatchDocumentUploadResponse {
  total: number;
  indexed: number;
  failed: number;
  results: BatchDocumentResult[];
}