import { Search, SlidersHorizontal, X } from 'lucide-react';
import { LeadFilters, LeadSource, LeadStatus, SortOrder } from '../../types';
import { Input, Select, Button } from '../ui';

interface LeadFiltersBarProps {
  filters: LeadFilters;
  searchInput: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: keyof LeadFilters, value: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  ...Object.values(LeadStatus).map((s) => ({ value: s, label: s })),
];

const sourceOptions = [
  { value: '', label: 'All Sources' },
  ...Object.values(LeadSource).map((s) => ({ value: s, label: s })),
];

const sortOptions = [
  { value: SortOrder.LATEST, label: 'Latest First' },
  { value: SortOrder.OLDEST, label: 'Oldest First' },
];

export default function LeadFiltersBar({
  filters,
  searchInput,
  onSearchChange,
  onFilterChange,
  onReset,
  hasActiveFilters,
}: LeadFiltersBarProps) {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
        <span className="text-sm font-medium text-slate-300">Filters</span>
        {hasActiveFilters && (
          <>
            <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
              Active
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              leftIcon={<X className="w-3 h-3" />}
              className="ml-auto text-slate-500 hover:text-red-400 hover:bg-red-500/10"
            >
              Clear all
            </Button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Input
          placeholder="Search by name or email..."
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="col-span-1 sm:col-span-2 lg:col-span-1"
        />

        <Select
          value={filters.status ?? ''}
          onChange={(e) => onFilterChange('status', e.target.value)}
          options={statusOptions}
        />

        <Select
          value={filters.source ?? ''}
          onChange={(e) => onFilterChange('source', e.target.value)}
          options={sourceOptions}
        />

        <Select
          value={filters.sort ?? SortOrder.LATEST}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          options={sortOptions}
        />
      </div>
    </div>
  );
}
