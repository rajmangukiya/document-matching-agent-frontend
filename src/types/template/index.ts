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

export interface TemplateListItem {
  id: number;
  title: string;
  documentType: string;
  description: string | null;
  fieldCount: number;
  ruleCount: number;
  journeyCount: number;
}

export interface FieldMatch {
  fieldId: number;
  fieldName: string;
  templateId: number;
  templateTitle: string;
}

export interface TemplateField {
  id: number;
  templateId: number;
  name: string;
  type: FieldType;
  position: number;
  matches: FieldMatch[];
  incomingCount: number;
}

export interface TemplateDetail {
  id: number;
  title: string;
  documentType: string;
  description: string | null;
  fields: TemplateField[];
}

export interface MatchCandidate {
  id: number;
  title: string;
  documentType: string;
  fields: { id: number; name: string; type: FieldType }[];
}

export interface TemplatePayload {
  title: string;
  documentType: string;
  description?: string | null;
}
