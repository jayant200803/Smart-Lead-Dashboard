import { Lead } from '../../types';
import { formatDateTime } from '../../utils/date';
import { Modal } from '../ui';
import { StatusBadge, SourceBadge } from './StatusBadge';
import { Calendar, Mail, User, FileText, UserCircle } from 'lucide-react';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}


export default function LeadDetailModal({ lead, isOpen, onClose }: LeadDetailModalProps) {
  if (!lead) return null;

  const creatorName = typeof lead.createdBy === 'object' ? lead.createdBy.name : 'Unknown';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lead Details" maxWidth="md">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 shadow-glow-sm flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-white">
              {lead.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-white">{lead.name}</h3>
            <p className="text-sm text-slate-400 font-mono">{lead.email}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <DetailItem icon={<Mail className="w-4 h-4" />} label="Email" value={lead.email} />
          <DetailItem
            icon={<User className="w-4 h-4" />}
            label="Status"
            value={<StatusBadge status={lead.status} />}
          />
          <DetailItem
            icon={<FileText className="w-4 h-4" />}
            label="Source"
            value={<SourceBadge source={lead.source} />}
          />
          <DetailItem
            icon={<UserCircle className="w-4 h-4" />}
            label="Created By"
            value={creatorName}
          />
          <DetailItem
            icon={<Calendar className="w-4 h-4" />}
            label="Created"
            value={formatDateTime(lead.createdAt)}
          />
          <DetailItem
            icon={<Calendar className="w-4 h-4" />}
            label="Updated"
            value={formatDateTime(lead.updatedAt)}
          />
        </div>

        {/* Notes */}
        {lead.notes && (
          <div className="pt-3 border-t border-white/[0.06]">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
              Notes
            </p>
            <p className="text-sm text-slate-300 bg-white/[0.04] border border-white/[0.06] rounded-lg p-3">
              {lead.notes}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-indigo-400/70">{icon}</span>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <div className="text-sm font-medium text-slate-200 mt-0.5">
          {value}
        </div>
      </div>
    </div>
  );
}
