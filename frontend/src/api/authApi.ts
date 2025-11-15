import apiClient from './apiClient'
import { User } from './userApi'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message?: string
  data: {
    token: string
    username: string
    role: string
    email: string
  }
}

export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse['data']> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', { username, password })
    return response.data
  },
  register: async (username: string, password: string, email: string, role?: string) => {
    return apiClient.post('/auth/register', { username, password, email, role })
  },
  getProfile: () => apiClient.get<{ success: boolean; data: User }>('/auth/profile'),
  updateProfile: (email: string) => apiClient.put<{ success: boolean; data: User }>('/auth/profile', { email }),
  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.put('/auth/change-password', { currentPassword, newPassword }),
}
