export type FieldType = 'text' | 'code' | 'number' | 'weight' | 'currency' | 'date' | 'party';

export const FIELD_TYPES: FieldType[] = [
  'text',
  'code',
  'number',
  'weight',
  'currency',
  'date',
  'party',
];

export interface DocumentSkeletonListItem {
  id: string;
  title: string;
  documentType: string;
  description: string | null;
  fieldCount: number;
  ruleCount: number;
  journeyCount: number;
}

export interface FieldMatch {
  fieldId: string;
  fieldName: string;
  documentSkeletonId: string;
  documentSkeletonTitle: string;
}

export interface DocumentSkeletonField {
  id: string;
  documentSkeletonId: string;
  name: string;
  type: FieldType;
  position: number;
  matches: FieldMatch[];
  incomingCount: number;
}

export interface DocumentSkeletonDetail {
  id: string;
  title: string;
  documentType: string;
  description: string | null;
  fields: DocumentSkeletonField[];
}

export interface MatchCandidate {
  id: string;
  title: string;
  documentType: string;
  fields: { id: string; name: string; type: FieldType }[];
}

export interface DocumentSkeletonPayload {
  title: string;
  documentType: string;
  description?: string | null;
}
