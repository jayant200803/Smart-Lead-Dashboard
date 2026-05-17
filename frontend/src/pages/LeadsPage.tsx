import { useState, useCallback } from 'react';
import { Plus, Download } from 'lucide-react';
import {
  useLeads,
  useCreateLead,
  useUpdateLead,
  useDeleteLead,
  useExportCSV,
} from '../hooks/useLeads';
import { useDebounce } from '../hooks/useDebounce';
import { useAuthStore } from '../contexts/authStore';
import LeadFiltersBar from '../components/leads/LeadFiltersBar';
import LeadsTable from '../components/leads/LeadsTable';
import Pagination from '../components/leads/Pagination';
import LeadForm from '../components/leads/LeadForm';
import LeadDetailModal from '../components/leads/LeadDetailModal';
import { Button, Modal, ConfirmDialog } from '../components/ui';
import {
  CreateLeadData,
  Lead,
  LeadFilters,
  LeadSource,
  LeadStatus,
  SortOrder,
  UpdateLeadData,
  UserRole,
} from '../types';

const DEFAULT_FILTERS: LeadFilters = {
  page: 1,
  limit: 10,
  status: '',
  source: '',
  search: '',
  sort: SortOrder.LATEST,
};

export default function LeadsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;

  // ─── Filter State ─────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 400);

  // Build query with debounced search
  const queryFilters: LeadFilters = {
    ...filters,
    search: debouncedSearch || undefined,
  };

  // ─── Data Fetching ────────────────────────────────────────────────────────
  const { data: response, isLoading, isError } = useLeads(queryFilters);
  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();
  const deleteMutation = useDeleteLead();
  const exportMutation = useExportCSV();

  // ─── Modal State ──────────────────────────────────────────────────────────
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleFilterChange = useCallback((key: keyof LeadFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : (value ? Number(value) : 1),
    }));
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearchInput('');
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleCreate = useCallback((data: CreateLeadData | UpdateLeadData) => {
    createMutation.mutate(data as CreateLeadData, {
      onSuccess: () => setShowCreateModal(false),
    });
  }, [createMutation]);

  const handleUpdate = useCallback((data: CreateLeadData | UpdateLeadData) => {
    if (!editingLead) return;
    updateMutation.mutate(
      { id: editingLead._id, data: data as UpdateLeadData },
      { onSuccess: () => setEditingLead(null) }
    );
  }, [editingLead, updateMutation]);

  const handleDelete = useCallback(() => {
    if (!deletingLead) return;
    deleteMutation.mutate(deletingLead._id, {
      onSuccess: () => setDeletingLead(null),
    });
  }, [deletingLead, deleteMutation]);

  const handleExport = useCallback(() => {
    exportMutation.mutate({
      status: filters.status as LeadStatus | undefined,
      source: filters.source as LeadSource | undefined,
      search: debouncedSearch || undefined,
    });
  }, [exportMutation, filters.status, filters.source, debouncedSearch]);

  const hasActiveFilters =
    !!filters.status || !!filters.source || !!searchInput || filters.sort !== SortOrder.LATEST;

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold gradient-text">Leads</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage and track your leads pipeline
          </p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={handleExport}
              isLoading={exportMutation.isPending}
            >
              Export CSV
            </Button>
          )}
          <Button
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setShowCreateModal(true)}
          >
            Add Lead
          </Button>
        </div>
      </div>

      {/* Filters */}
      <LeadFiltersBar
        filters={filters}
        searchInput={searchInput}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Table */}
      <div className="card overflow-hidden">
        {isError ? (
          <div className="flex items-center justify-center py-16 text-center">
            <div>
              <p className="text-sm font-medium text-red-400 mb-1">Failed to load leads</p>
              <p className="text-xs text-slate-500">Check your connection and try refreshing the page.</p>
            </div>
          </div>
        ) : (
          <LeadsTable
            leads={response?.data ?? []}
            isLoading={isLoading}
            onEdit={setEditingLead}
            onDelete={setDeletingLead}
            onView={setViewingLead}
          />
        )}

        {/* Pagination */}
        {!isError && response?.pagination && response.pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-white/[0.06]">
            <Pagination meta={response.pagination} onPageChange={handlePageChange} />
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Lead"
      >
        <LeadForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingLead}
        onClose={() => setEditingLead(null)}
        title="Edit Lead"
      >
        {editingLead && (
          <LeadForm
            initialData={editingLead}
            onSubmit={handleUpdate}
            onCancel={() => setEditingLead(null)}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>

      {/* View Modal */}
      <LeadDetailModal
        lead={viewingLead}
        isOpen={!!viewingLead}
        onClose={() => setViewingLead(null)}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingLead}
        onClose={() => setDeletingLead(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete "${deletingLead?.name}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
