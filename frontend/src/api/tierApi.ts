import apiClient from './apiClient'

export interface Tier {
  id: number
  name: string
  minPoints: number
  maxPoints: number
  benefitsDescription?: string
  priority: number
  createdAt: string
  updatedAt: string
}

export const tierApi = {
  getAll: () => apiClient.get<{ success: boolean; data: Tier[] }>('/tiers'),
  getById: (id: number) => apiClient.get<{ success: boolean; data: Tier }>(`/tiers/${id}`),
  create: (data: Tier) => apiClient.post<{ success: boolean; data: Tier }>('/tiers', data),
  update: (id: number, data: Tier) => apiClient.put<{ success: boolean; data: Tier }>(`/tiers/${id}`, data),
  delete: (id: number) => apiClient.delete(`/tiers/${id}`),
}

