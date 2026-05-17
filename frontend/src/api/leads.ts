import apiClient from './client';
import {
  ApiResponse,
  CreateLeadData,
  Lead,
  LeadFilters,
  LeadStats,
  PaginatedResponse,
  UpdateLeadData,
} from '../types';

export const leadsApi = {
  getLeads: async (filters: LeadFilters = {}): Promise<PaginatedResponse<Lead>> => {
    const params = new URLSearchParams();
    if (filters.page)   params.set('page',   String(filters.page));
    if (filters.limit)  params.set('limit',  String(filters.limit));
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.search) params.set('search', filters.search);
    if (filters.sort)   params.set('sort',   filters.sort);

    const { data } = await apiClient.get<PaginatedResponse<Lead>>(
      `/leads?${params.toString()}`
    );
    return data;
  },

  getLead: async (id: string): Promise<Lead> => {
    const { data } = await apiClient.get<ApiResponse<Lead>>(`/leads/${id}`);
    if (!data.data) throw new Error('Lead not found in response');
    return data.data;
  },

  createLead: async (leadData: CreateLeadData): Promise<Lead> => {
    const { data } = await apiClient.post<ApiResponse<Lead>>('/leads', leadData);
    if (!data.data) throw new Error('Invalid response from server');
    return data.data;
  },

  updateLead: async (id: string, leadData: UpdateLeadData): Promise<Lead> => {
    const { data } = await apiClient.put<ApiResponse<Lead>>(`/leads/${id}`, leadData);
    if (!data.data) throw new Error('Invalid response from server');
    return data.data;
  },

  deleteLead: async (id: string): Promise<void> => {
    await apiClient.delete(`/leads/${id}`);
  },

  getStats: async (): Promise<LeadStats> => {
    const { data } = await apiClient.get<ApiResponse<LeadStats>>('/leads/stats');
    if (!data.data) throw new Error('Invalid response from server');
    return data.data;
  },

  exportCSV: async (filters: Omit<LeadFilters, 'page' | 'limit'> = {}): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.search) params.set('search', filters.search);

    const response = await apiClient.get(`/leads/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data as Blob;
  },
};
