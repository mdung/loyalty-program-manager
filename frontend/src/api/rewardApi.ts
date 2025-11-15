import apiClient from './apiClient'
import { PageResponse } from './customerApi'

export interface Reward {
  id: number
  name: string
  description?: string
  requiredPoints: number
  type: 'VOUCHER' | 'DISCOUNT' | 'GIFT' | 'OTHER'
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Redemption {
  id: number
  customerId: number
  customerName: string
  membershipCode: string
  rewardId: number
  rewardName: string
  pointsUsed: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
  storeId: number
  storeName: string
  handledBy?: string
  redeemedAt: string
  updatedAt: string
}

export const rewardApi = {
  getAll: () => apiClient.get<{ success: boolean; data: Reward[] }>('/rewards'),
  getById: (id: number) => apiClient.get<{ success: boolean; data: Reward }>(`/rewards/${id}`),
  create: (data: Reward) => apiClient.post<{ success: boolean; data: Reward }>('/rewards', data),
  update: (id: number, data: Reward) => apiClient.put<{ success: boolean; data: Reward }>(`/rewards/${id}`, data),
  delete: (id: number) => apiClient.delete(`/rewards/${id}`),
  getRedemptions: (page = 0, size = 10, status?: string, storeId?: number, fromDate?: string, toDate?: string) => {
    return apiClient.get<{ success: boolean; data: PageResponse<Redemption> }>('/rewards/redemptions', {
      params: { page, size, status, storeId, fromDate, toDate },
    })
  },
  approveRedemption: (id: number) => apiClient.put<{ success: boolean; data: Redemption }>(`/rewards/redemptions/${id}/approve`),
  rejectRedemption: (id: number) => apiClient.put<{ success: boolean; data: Redemption }>(`/rewards/redemptions/${id}/reject`),
  completeRedemption: (id: number) => apiClient.put<{ success: boolean; data: Redemption }>(`/rewards/redemptions/${id}/complete`),
}

