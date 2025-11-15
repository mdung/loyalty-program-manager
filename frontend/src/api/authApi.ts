import apiClient from './apiClient'

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
}

