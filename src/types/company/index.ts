import type { CompanyRole, User } from '../user';

export interface Company {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyListItem extends Company {
  userCount: number;
  journeyCount: number;
}

export interface CompanyDetail extends Company {
  users: User[];
}

export interface PlatformStats {
  companies: number;
  activeCompanies: number;
  users: number;
  journeys: number;
  documents: number;
  files: number;
}

export interface CreateCompanyPayload {
  name: string;
  adminUsername: string;
  adminPassword: string;
}

export interface UpdateCompanyUserPayload {
  role?: CompanyRole;
  isActive?: boolean;
  password?: string;
}
