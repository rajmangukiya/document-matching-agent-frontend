export const PATHS = {
  LOGIN: '/login',
  HOME: '/',
  ACCOUNT: '/account',

  // Super admin
  ADMIN: '/admin',
  ADMIN_COMPANY: '/admin/companies/:id',

  // Company workspace
  JOURNEYS: '/journeys',
  JOURNEY: '/journeys/:id',
  DOCUMENT: '/documents/:id',
  DOCUMENT_SKELETONS: '/document-skeletons',
  DOCUMENT_SKELETON: '/document-skeletons/:id',
  USERS: '/users',
} as const;

export const toPath = {
  adminCompany: (id: string) => `/admin/companies/${id}`,
  journey: (id: string) => `/journeys/${id}`,
  document: (id: string) => `/documents/${id}`,
  documentSkeleton: (id: string) => `/document-skeletons/${id}`,
};
