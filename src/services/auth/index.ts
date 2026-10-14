import type { ChangePasswordPayload, LoginPayload, SessionUser } from '../../types/user';
import apiCall from '../../utils/api-call';

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public login(payload: LoginPayload): Promise<SessionUser> {
    return apiCall.post<SessionUser>('/auth/login', payload);
  }

  public me(): Promise<SessionUser> {
    return apiCall.get<SessionUser>('/auth/me');
  }

  public logout(): Promise<null> {
    return apiCall.post<null>('/auth/logout');
  }

  public logoutAll(): Promise<null> {
    return apiCall.post<null>('/auth/logout-all');
  }

  public changePassword(payload: ChangePasswordPayload): Promise<null> {
    return apiCall.patch<null>('/auth/change-password', payload);
  }
}

export default AuthService.getInstance();
