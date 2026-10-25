
export interface DocumentUploadResponse {
  filename: string;
  status: "indexed";
  chunks_created: number;
}
