import apiClient from './apiClient'

export interface Store {
  id: number
  name: string
  code: string
  address?: string
  city?: string
  country?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export const storeApi = {
  getAll: () => apiClient.get<{ success: boolean; data: Store[] }>('/stores'),
  getById: (id: number) => apiClient.get<{ success: boolean; data: Store }>(`/stores/${id}`),
  create: (data: Store) => apiClient.post<{ success: boolean; data: Store }>('/stores', data),
  update: (id: number, data: Store) => apiClient.put<{ success: boolean; data: Store }>(`/stores/${id}`, data),
  delete: (id: number) => apiClient.delete(`/stores/${id}`),
}

