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
  SKELETONS: '/skeletons',
  SKELETON: '/skeletons/:id',
  USERS: '/users',
} as const;

export const toPath = {
  adminCompany: (id: number) => `/admin/companies/${id}`,
  journey: (id: number) => `/journeys/${id}`,
  document: (id: number) => `/documents/${id}`,
  skeleton: (id: number) => `/skeletons/${id}`,
};
