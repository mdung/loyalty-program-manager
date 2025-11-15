import apiClient from './apiClient'

export interface DashboardOverview {
  totalCustomers: number
  activeCustomers: number
  totalPointsIssued: number
  totalPointsRedeemed: number
  outstandingPointsBalance: number
}

export interface TopCustomer {
  customerId: number
  customerName: string
  membershipCode: string
  totalPointsEarned: number
  currentPointsBalance: number
  tierName: string
}

export const dashboardApi = {
  getOverview: () => apiClient.get<{ success: boolean; data: DashboardOverview }>('/dashboard/overview'),
  getTopCustomers: (limit = 10) => apiClient.get<{ success: boolean; data: TopCustomer[] }>('/dashboard/top-customers', { params: { limit } }),
}

