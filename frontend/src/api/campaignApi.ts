import apiClient from './apiClient'

export interface Campaign {
  id: number
  name: string
  description?: string
  startDate: string
  endDate: string
  earningMultiplier: number
  conditions?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export const campaignApi = {
  getAll: () => apiClient.get<{ success: boolean; data: Campaign[] }>('/campaigns'),
  getById: (id: number) => apiClient.get<{ success: boolean; data: Campaign }>(`/campaigns/${id}`),
  create: (data: Campaign) => apiClient.post<{ success: boolean; data: Campaign }>('/campaigns', data),
  update: (id: number, data: Campaign) => apiClient.put<{ success: boolean; data: Campaign }>(`/campaigns/${id}`, data),
  delete: (id: number) => apiClient.delete(`/campaigns/${id}`),
}

