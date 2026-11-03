
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  uploadDocument,
  uploadDocuments,
} from "@/services/document-service";

import type {
  BatchDocumentUploadResponse,
  DocumentUploadResponse,
} from "@/types/document";

interface UseDocumentUploadReturn {
  isUploading: boolean;
  error: string | null;
  result: DocumentUploadResponse | null;
  batchResult: BatchDocumentUploadResponse | null;
  sendDocument: (file: File) => Promise<void>;
  sendDocuments: (files: File[]) => Promise<void>;
  reset: () => void;
}

export function useDocumentUpload(): UseDocumentUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<DocumentUploadResponse | null>(null);
  const [batchResult, setBatchResult] =
    useState<BatchDocumentUploadResponse | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const isRequestPendingRef = useRef(false);

  const sendDocument = useCallback(async (file: File): Promise<void> => {
    if (isRequestPendingRef.current) {
      return;
    }

    isRequestPendingRef.current = true;

    const requestId = ++requestIdRef.current;
    const controller = new AbortController();

    abortControllerRef.current = controller;

    setError(null);
    setResult(null);
    setBatchResult(null);
    setIsUploading(true);

    try {
      const response = await uploadDocument(file, controller.signal);

      if (requestId !== requestIdRef.current) {
        return;
      }

      setResult(response);
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
          : "Ocorreu um erro inesperado ao enviar o documento.",
      );
    } finally {
      if (requestId === requestIdRef.current) {
        isRequestPendingRef.current = false;
        abortControllerRef.current = null;
        setIsUploading(false);
      }
    }
  }, []);

  const sendDocuments = useCallback(async (files: File[]): Promise<void> => {
    if (isRequestPendingRef.current) {
      return;
    }

    isRequestPendingRef.current = true;

    const requestId = ++requestIdRef.current;
    const controller = new AbortController();

    abortControllerRef.current = controller;

    setError(null);
    setResult(null);
    setBatchResult(null);
    setIsUploading(true);

    try {
      const response = await uploadDocuments(files, controller.signal);

      if (requestId !== requestIdRef.current) {
        return;
      }

      setBatchResult(response);
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
          : "Ocorreu um erro inesperado ao enviar os documentos.",
      );
    } finally {
      if (requestId === requestIdRef.current) {
        isRequestPendingRef.current = false;
        abortControllerRef.current = null;
        setIsUploading(false);
      }
    }
  }, []);

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    isRequestPendingRef.current = false;

    setIsUploading(false);
    setError(null);
    setResult(null);
    setBatchResult(null);
  }, []);

  useEffect(() => {
    return () => {
      requestIdRef.current += 1;
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      isRequestPendingRef.current = false;
    };
  }, []);

  return {
    isUploading,
    error,
    result,
    batchResult,
    sendDocument,
    sendDocuments,
    reset,
  };
}
