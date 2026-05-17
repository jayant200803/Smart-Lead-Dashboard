import { LeadSource, LeadStatus } from '../../types';
import { Badge } from '../ui';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'cyan';

const statusConfig: Record<LeadStatus, { label: string; variant: BadgeVariant }> = {
  [LeadStatus.NEW]:       { label: 'New',       variant: 'info' },
  [LeadStatus.CONTACTED]: { label: 'Contacted',  variant: 'warning' },
  [LeadStatus.QUALIFIED]: { label: 'Qualified',  variant: 'success' },
  [LeadStatus.LOST]:      { label: 'Lost',       variant: 'danger' },
};

const sourceConfig: Record<LeadSource, { label: string; variant: BadgeVariant }> = {
  [LeadSource.WEBSITE]:   { label: 'Website',   variant: 'default' },
  [LeadSource.INSTAGRAM]: { label: 'Instagram',  variant: 'purple' },
  [LeadSource.REFERRAL]:  { label: 'Referral',   variant: 'cyan' },
};

export const StatusBadge = ({ status }: { status: LeadStatus }) => {
  const config = statusConfig[status] ?? { label: status, variant: 'default' as BadgeVariant };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const SourceBadge = ({ source }: { source: LeadSource }) => {
  const config = sourceConfig[source] ?? { label: source, variant: 'default' as BadgeVariant };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};
