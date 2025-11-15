import apiClient from './apiClient'
import { PageResponse } from './customerApi'

export interface Transaction {
  id: number
  customerId: number
  customerName: string
  membershipCode: string
  storeId: number
  storeName: string
  type: 'EARN' | 'REDEEM' | 'ADJUSTMENT'
  points: number
  transactionAmount?: number
  description?: string
  createdBy: string
  createdAt: string
}

export interface EarnPointsRequest {
  customerId: number
  storeId: number
  transactionAmount: number
  description?: string
}

export interface RedeemPointsRequest {
  customerId: number
  storeId: number
  rewardId: number
  pointsUsed: number
  description?: string
}

export const transactionApi = {
  getAll: (page = 0, size = 10, customerId?: number, storeId?: number, type?: string, fromDate?: string, toDate?: string) => {
    return apiClient.get<{ success: boolean; data: PageResponse<Transaction> }>('/transactions', {
      params: { page, size, customerId, storeId, type, fromDate, toDate },
    })
  },
  earn: (data: EarnPointsRequest) => {
    return apiClient.post<{ success: boolean; data: Transaction }>('/transactions/earn', data)
  },
  redeem: (data: RedeemPointsRequest) => {
    return apiClient.post<{ success: boolean; data: Transaction }>('/transactions/redeem', data)
  },
  adjust: (data: any) => {
    return apiClient.post<{ success: boolean; data: Transaction }>('/transactions/adjust', data)
  },
}

