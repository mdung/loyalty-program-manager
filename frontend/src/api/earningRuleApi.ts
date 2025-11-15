import apiClient from './apiClient'

export interface EarningRule {
  id: number
  name: string
  basePointsPerCurrencyUnit: number
  minAmount?: number
  maxAmount?: number
  storeId?: number
  storeName?: string
  tierId?: number
  tierName?: string
  campaignId?: number
  campaignName?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export const earningRuleApi = {
  getAll: () => apiClient.get<{ success: boolean; data: EarningRule[] }>('/earning-rules'),
  getById: (id: number) => apiClient.get<{ success: boolean; data: EarningRule }>(`/earning-rules/${id}`),
  create: (data: EarningRule) => apiClient.post<{ success: boolean; data: EarningRule }>('/earning-rules', data),
  update: (id: number, data: EarningRule) => apiClient.put<{ success: boolean; data: EarningRule }>(`/earning-rules/${id}`, data),
  delete: (id: number) => apiClient.delete(`/earning-rules/${id}`),
}

