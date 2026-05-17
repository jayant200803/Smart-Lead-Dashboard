import apiClient from './client';
import {
  ApiResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '../types';

interface AuthResponseData {
  user: User;
  token: string;
}

export const authApi = {
  register: async (credentials: RegisterCredentials): Promise<AuthResponseData> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponseData>>(
      '/auth/register',
      credentials
    );
    if (!data.data) throw new Error('Invalid response from server');
    return data.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponseData> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponseData>>(
      '/auth/login',
      credentials
    );
    if (!data.data) throw new Error('Invalid response from server');
    return data.data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<User>>('/auth/me');
    if (!data.data) throw new Error('Invalid response from server');
    return data.data;
  },
};
