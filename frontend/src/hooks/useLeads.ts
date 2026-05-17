import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { leadsApi } from '../api/leads';
import {
  CreateLeadData,
  Lead,
  LeadFilters,
  UpdateLeadData,
} from '../types';

export const LEADS_QUERY_KEY = 'leads';
export const STATS_QUERY_KEY = 'lead-stats';

export const useLeads = (filters: LeadFilters) => {
  return useQuery({
    queryKey: [LEADS_QUERY_KEY, filters],
    queryFn: () => leadsApi.getLeads(filters),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
};

export const useLeadStats = () => {
  return useQuery({
    queryKey: [STATS_QUERY_KEY],
    queryFn: leadsApi.getStats,
    staleTime: 60_000,
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation<Lead, Error, CreateLeadData>({
    mutationFn: leadsApi.createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [STATS_QUERY_KEY] });
      toast.success('Lead created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create lead');
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation<Lead, Error, { id: string; data: UpdateLeadData }>({
    mutationFn: ({ id, data }) => leadsApi.updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [STATS_QUERY_KEY] });
      toast.success('Lead updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update lead');
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: leadsApi.deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [STATS_QUERY_KEY] });
      toast.success('Lead deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete lead');
    },
  });
};

export const useExportCSV = () => {
  return useMutation<Blob, Error, Omit<LeadFilters, 'page' | 'limit'>>({
    mutationFn: leadsApi.exportCSV,
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('CSV exported successfully!');
    },
    onError: () => {
      toast.error('Failed to export CSV');
    },
  });
};
