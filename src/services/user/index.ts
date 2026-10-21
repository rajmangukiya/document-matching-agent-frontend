import type { CreateUserPayload, UpdateUserPayload, User } from '../../types/user';
import apiCall from '../../utils/api-call';

// Company admin: users of the signed-in user's company
class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public list(): Promise<User[]> {
    return apiCall.get<User[]>('/users');
  }

  public create(payload: CreateUserPayload): Promise<User> {
    return apiCall.post<User>('/users', payload);
  }

  public update(id: string, payload: UpdateUserPayload): Promise<User> {
    return apiCall.patch<User>(`/users/${id}`, payload);
  }

  public resetPassword(id: string, password: string): Promise<null> {
    return apiCall.put<null>(`/users/${id}/password`, { password });
  }

  public remove(id: string): Promise<null> {
    return apiCall.delete<null>(`/users/${id}`);
  }
}

export default UserService.getInstance();
