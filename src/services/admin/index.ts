import type {
  Company,
  CompanyDetail,
  CompanyListItem,
  CreateCompanyPayload,
  PlatformStats,
  UpdateCompanyUserPayload,
} from '../../types/company';
import type { CreateUserPayload, User } from '../../types/user';
import apiCall from '../../utils/api-call';

// Platform super admin
class AdminService {
  private static instance: AdminService;

  private constructor() {}

  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  public stats(): Promise<PlatformStats> {
    return apiCall.get<PlatformStats>('/admin/stats');
  }

  public listCompanies(): Promise<CompanyListItem[]> {
    return apiCall.get<CompanyListItem[]>('/admin/companies');
  }

  public createCompany(payload: CreateCompanyPayload): Promise<Company> {
    return apiCall.post<Company>('/admin/companies', payload);
  }

  public getCompany(id: number): Promise<CompanyDetail> {
    return apiCall.get<CompanyDetail>(`/admin/companies/${id}`);
  }

  public updateCompany(
    id: number,
    payload: { name?: string; isActive?: boolean },
  ): Promise<Company> {
    return apiCall.patch<Company>(`/admin/companies/${id}`, payload);
  }

  public createUser(companyId: number, payload: CreateUserPayload): Promise<User> {
    return apiCall.post<User>(`/admin/companies/${companyId}/users`, payload);
  }

  public updateUser(
    companyId: number,
    userId: number,
    payload: UpdateCompanyUserPayload,
  ): Promise<User> {
    return apiCall.patch<User>(`/admin/companies/${companyId}/users/${userId}`, payload);
  }
}

export default AdminService.getInstance();
