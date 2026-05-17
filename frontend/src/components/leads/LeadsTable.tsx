import { Edit2, Trash2, Eye } from 'lucide-react';
import { Lead, UserRole } from '../../types';
import { formatDate } from '../../utils/date';
import { StatusBadge, SourceBadge } from './StatusBadge';
import { Button, Spinner, EmptyState } from '../ui';
import { useAuthStore } from '../../contexts/authStore';
import { Users } from 'lucide-react';

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onView: (lead: Lead) => void;
}


export default function LeadsTable({
  leads,
  isLoading,
  onEdit,
  onDelete,
  onView,
}: LeadsTableProps) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Spinner size="lg" />
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <EmptyState
        icon={<Users className="w-6 h-6" />}
        title="No leads found"
        description="Try adjusting your filters or create a new lead to get started."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-white/[0.06] bg-white/[0.02]">
          <tr>
            <th className="table-header">Name</th>
            <th className="table-header">Email</th>
            <th className="table-header">Status</th>
            <th className="table-header">Source</th>
            {isAdmin && <th className="table-header">Created By</th>}
            <th className="table-header">Date</th>
            <th className="table-header text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {leads.map((lead) => (
            <tr
              key={lead._id}
              className="hover:bg-white/[0.03] transition-colors duration-150 group"
            >
              <td className="table-cell">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-glow-sm">
                    <span className="text-xs font-semibold text-white">
                      {lead.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-slate-200 group-hover:text-white transition-colors">
                    {lead.name}
                  </span>
                </div>
              </td>
              <td className="table-cell text-slate-500 font-mono text-xs">
                {lead.email}
              </td>
              <td className="table-cell">
                <StatusBadge status={lead.status} />
              </td>
              <td className="table-cell">
                <SourceBadge source={lead.source} />
              </td>
              {isAdmin && (
                <td className="table-cell text-slate-500">
                  {typeof lead.createdBy === 'object' ? lead.createdBy.name : 'N/A'}
                </td>
              )}
              <td className="table-cell text-slate-500 whitespace-nowrap">
                {formatDate(lead.createdAt)}
              </td>
              <td className="table-cell">
                <div className="flex items-center gap-1 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(lead)}
                    className="hover:bg-white/[0.06] hover:text-indigo-400"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(lead)}
                    className="hover:bg-white/[0.06] hover:text-indigo-400"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(lead)}
                    className="hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
