import type { FieldType } from '../template';

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
  id: number;
  documentId: number;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

export interface MatchCheck {
  targetTemplateTitle: string;
  targetFieldName: string;
  targetDocumentId: number | null;
  targetDocumentTitle: string | null;
  targetSegmentId: number | null;
  targetSegmentName: string | null;
  value: string | null;
  status: CheckStatus;
}

export interface FieldRow {
  id: number;
  name: string;
  type: FieldType;
  value: string | null;
  isManual: boolean;
  confidence: number | null;
  sourceFileId: number | null;
  sourceFileName: string | null;
  result: FieldResult;
  checks: MatchCheck[];
}

export interface DocumentDetail {
  id: number;
  title: string;
  documentType: string;
  status: DocumentStatus;
  templateId: number | null;
  journey: { id: number; title: string };
  segment: { id: number; name: string };
  files: UploadedFile[];
  counts: DocumentCounts | null;
  fields: FieldRow[];
}
