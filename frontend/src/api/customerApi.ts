import apiClient from './apiClient'

export interface Customer {
  id: number
  membershipCode: string
  fullName: string
  phone?: string
  email?: string
  dateOfBirth?: string
  gender?: string
  address?: string
  city?: string
  country?: string
  tierId?: number
  tierName?: string
  currentPointsBalance: number
  registrationDate: string
  createdAt: string
  updatedAt: string
}

export interface CreateCustomerRequest {
  fullName: string
  phone?: string
  email?: string
  dateOfBirth?: string
  gender?: string
  address?: string
  city?: string
  country?: string
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export const customerApi = {
  getAll: (page = 0, size = 10, name?: string, phone?: string, tierId?: number) => {
    return apiClient.get<{ success: boolean; data: PageResponse<Customer> }>('/customers', {
      params: { page, size, name, phone, tierId },
    })
  },
  getById: (id: number) => {
    return apiClient.get<{ success: boolean; data: Customer }>(`/customers/${id}`)
  },
  getSummary: (id: number) => {
    return apiClient.get<{ success: boolean; data: any }>(`/customers/${id}/summary`)
  },
  create: (data: CreateCustomerRequest) => {
    return apiClient.post<{ success: boolean; data: Customer }>('/customers', data)
  },
  update: (id: number, data: CreateCustomerRequest) => {
    return apiClient.put<{ success: boolean; data: Customer }>(`/customers/${id}`, data)
  },
  getTransactions: (id: number, page = 0, size = 10) => {
    return apiClient.get<{ success: boolean; data: any[] }>(`/transactions/customer/${id}`, {
      params: { page, size },
    })
  },
}

