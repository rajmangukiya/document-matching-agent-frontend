import type { FieldType } from '../document-skeleton';

export type DocumentStatus = 'pending' | 'extracting' | 'ready' | 'failed';

export type FieldResult = 'not_extracted' | 'no_rule' | 'matched' | 'not_matched' | 'waiting';

export type CheckStatus =
  | 'absent'
  | 'awaiting_upload'
  | 'extracting'
  | 'no_value'
  | 'self_missing'
  | 'matched'
  | 'not_matched';

export interface DocumentCounts {
  total: number;
  extracted: number;
  notExtracted: number;
  matched: number;
  notMatched: number;
}

export interface UploadedFile {
  id: string;
  documentId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

export interface MatchCheck {
  targetDocumentSkeletonTitle: string;
  targetFieldName: string;
  targetDocumentId: string | null;
  targetDocumentTitle: string | null;
  targetSegmentId: string | null;
  targetSegmentName: string | null;
  value: string | null;
  status: CheckStatus;
}

export interface FieldRow {
  id: string;
  name: string;
  type: FieldType;
  value: string | null;
  isManual: boolean;
  confidence: number | null;
  sourceFileId: string | null;
  sourceFileName: string | null;
  result: FieldResult;
  checks: MatchCheck[];
}

export interface DocumentDetail {
  id: string;
  title: string;
  documentType: string;
  status: DocumentStatus;
  documentSkeletonId: string | null;
  journey: { id: string; title: string };
  segment: { id: string; name: string };
  files: UploadedFile[];
  counts: DocumentCounts | null;
  fields: FieldRow[];
}
