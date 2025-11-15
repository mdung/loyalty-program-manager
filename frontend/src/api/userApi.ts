import apiClient from './apiClient'
import { PageResponse } from './customerApi'

export interface User {
  id: number
  username: string
  email: string
  role: 'ADMIN' | 'MANAGER' | 'STAFF'
  status: 'ACTIVE' | 'DISABLED'
  createdAt: string
  updatedAt: string
}

export interface CreateUserRequest {
  username: string
  password: string
  email: string
  role?: 'ADMIN' | 'MANAGER' | 'STAFF'
}

export interface UpdateUserRequest {
  role?: 'ADMIN' | 'MANAGER' | 'STAFF'
  status?: 'ACTIVE' | 'DISABLED'
}

export const userApi = {
  getAll: (page = 0, size = 10, search?: string) => {
    return apiClient.get<{ success: boolean; data: PageResponse<User> }>('/users', {
      params: { page, size, search },
    })
  },
  getById: (id: number) => apiClient.get<{ success: boolean; data: User }>(`/users/${id}`),
  create: (data: CreateUserRequest) => apiClient.post<{ success: boolean; data: User }>('/users', data),
  update: (id: number, data: UpdateUserRequest) => apiClient.put<{ success: boolean; data: User }>(`/users/${id}`, data),
  delete: (id: number) => apiClient.delete(`/users/${id}`),
}

