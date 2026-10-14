// Mirrors backend utils/permissions
export const Permission = {
  MANAGE_COMPANIES: 'companies:manage',
  MANAGE_USERS: 'users:manage',
  VIEW_TEMPLATES: 'templates:view',
  MANAGE_TEMPLATES: 'templates:manage',
  VIEW_JOURNEYS: 'journeys:view',
  MANAGE_JOURNEYS: 'journeys:manage',
  MANAGE_DOCUMENT_DATA: 'documents:data',
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];
