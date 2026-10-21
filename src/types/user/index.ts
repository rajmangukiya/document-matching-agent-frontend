import type { Permission } from '../permission';

export type UserRole = 'super_admin' | 'admin' | 'skeleton_designer' | 'operations' | 'viewer';
export type CompanyRole = Exclude<UserRole, 'super_admin'>;

export const COMPANY_ROLES: CompanyRole[] = ['admin', 'skeleton_designer', 'operations', 'viewer'];

export interface User {
  id: string;
  username: string;
  role: UserRole;
  companyId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SessionUser extends User {
  company: { id: string; name: string } | null;
  permissions: Permission[];
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface CreateUserPayload {
  username: string;
  password: string;
  role: CompanyRole;
}

export interface UpdateUserPayload {
  role?: CompanyRole;
  isActive?: boolean;
}
