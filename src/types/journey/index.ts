import type { DocumentCounts, DocumentStatus } from '../document';

export type JourneyStatus = 'draft' | 'in_progress' | 'complete';

export interface JourneyListItem {
  id: number;
  title: string;
  description: string | null;
  segmentCount: number;
  documentCount: number;
  uploadedCount: number;
  status: JourneyStatus;
  createdAt: string;
}

export interface DocumentSummary {
  id: number;
  segmentId: number;
  templateId: number | null;
  title: string;
  documentType: string;
  status: DocumentStatus;
  fileCount: number;
  counts: DocumentCounts | null;
}

export interface SegmentWithDocuments {
  id: number;
  journeyId: number;
  name: string;
  position: number;
  documents: DocumentSummary[];
}

export interface JourneyDetail {
  id: number;
  title: string;
  description: string | null;
  createdAt: string;
  stats: { documents: number; uploaded: number; matched: number; notMatched: number };
  segments: SegmentWithDocuments[];
}

export interface JourneyPayload {
  title: string;
  description?: string | null;
}
