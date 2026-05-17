import { Users, UserCheck, UserX, Phone, Globe, Instagram, Share2, TrendingUp, Activity } from 'lucide-react';
import { useLeadStats } from '../hooks/useLeads';
import { Spinner } from '../components/ui';
import { LeadSource, LeadStatus } from '../types';
import { StatCard, StatCardProps } from '../components/dashboard/StatCard';
import { RingCard } from '../components/dashboard/RingCard';
import { MetricBar } from '../components/dashboard/MetricBar';
import clsx from 'clsx';

export default function DashboardPage() {
  const { data: stats, isLoading, isError } = useLeadStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="card p-8 text-center">
        <p className="text-sm text-slate-500">Failed to load dashboard data. Please try again.</p>
      </div>
    );
  }

  const qualifiedPct =
    stats.total > 0
      ? ((stats.byStatus[LeadStatus.QUALIFIED] ?? 0) / stats.total * 100).toFixed(0)
      : '0';

  const statusCards: StatCardProps[] = [
    { label: 'Total Leads', value: stats.total,                               icon: <Users className="w-5 h-5" />,      accent: 'indigo',  subtitle: `${qualifiedPct}% qualified` },
    { label: 'New',         value: stats.byStatus[LeadStatus.NEW] ?? 0,       icon: <TrendingUp className="w-5 h-5" />, accent: 'sky'     },
    { label: 'Contacted',   value: stats.byStatus[LeadStatus.CONTACTED] ?? 0, icon: <Phone className="w-5 h-5" />,      accent: 'amber'   },
    { label: 'Qualified',   value: stats.byStatus[LeadStatus.QUALIFIED] ?? 0, icon: <UserCheck className="w-5 h-5" />,  accent: 'emerald' },
    { label: 'Lost',        value: stats.byStatus[LeadStatus.LOST] ?? 0,      icon: <UserX className="w-5 h-5" />,      accent: 'red'     },
  ];

  const sourceCards: StatCardProps[] = [
    { label: 'Website',   value: stats.bySource[LeadSource.WEBSITE] ?? 0,   icon: <Globe className="w-5 h-5" />,     accent: 'slate'  },
    { label: 'Instagram', value: stats.bySource[LeadSource.INSTAGRAM] ?? 0, icon: <Instagram className="w-5 h-5" />, accent: 'purple' },
    { label: 'Referral',  value: stats.bySource[LeadSource.REFERRAL] ?? 0,  icon: <Share2 className="w-5 h-5" />,    accent: 'cyan'   },
  ];

  const pipelineBarSegments = [
    { status: LeadStatus.NEW,       gradient: 'from-sky-500 to-blue-500'     },
    { status: LeadStatus.CONTACTED, gradient: 'from-amber-500 to-orange-500' },
    { status: LeadStatus.QUALIFIED, gradient: 'from-emerald-500 to-teal-500' },
    { status: LeadStatus.LOST,      gradient: 'from-red-500 to-rose-500'     },
  ];

  const pipelineRingCards = [
    { label: 'New',       status: LeadStatus.NEW,       stroke: '#38bdf8', badgeBg: 'bg-sky-500/10 border-sky-500/20',         badgeText: 'text-sky-400'     },
    { label: 'Contacted', status: LeadStatus.CONTACTED, stroke: '#f59e0b', badgeBg: 'bg-amber-500/10 border-amber-500/20',     badgeText: 'text-amber-400'   },
    { label: 'Qualified', status: LeadStatus.QUALIFIED, stroke: '#10b981', badgeBg: 'bg-emerald-500/10 border-emerald-500/20', badgeText: 'text-emerald-400' },
    { label: 'Lost',      status: LeadStatus.LOST,      stroke: '#f43f5e', badgeBg: 'bg-red-500/10 border-red-500/20',         badgeText: 'text-red-400'     },
  ];

  const sourceMetrics = [
    { label: 'Website',   value: stats.bySource[LeadSource.WEBSITE] ?? 0,   gradient: 'from-slate-500 to-slate-400', textColor: 'text-slate-400'  },
    { label: 'Instagram', value: stats.bySource[LeadSource.INSTAGRAM] ?? 0, gradient: 'from-purple-600 to-pink-500', textColor: 'text-purple-400' },
    { label: 'Referral',  value: stats.bySource[LeadSource.REFERRAL] ?? 0,  gradient: 'from-cyan-500 to-indigo-500', textColor: 'text-cyan-400'   },
  ];

  return (
    <div className="space-y-6">

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Overview of your lead pipeline</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-xs text-slate-500">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>{stats.total} leads total</span>
        </div>
      </div>

      {/* ── Status Stat Cards ────────────────────────────────────────── */}
      <div>
        <h2 className="text-xs font-semibold text-indigo-400/70 uppercase tracking-widest mb-3">By Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {statusCards.map((card, i) => (
            <div
              key={card.label}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
            >
              <StatCard {...card} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Pipeline Distribution ──────────────────────────────────── */}
      {stats.total > 0 && (
        <div
          className="glass-card p-6 animate-slide-up"
          style={{ animationDelay: '320ms', animationFillMode: 'both' }}
        >
          <div className="mb-5">
            <h2 className="text-xs font-semibold text-indigo-400/70 uppercase tracking-widest">
              Pipeline Distribution
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">{stats.total} leads across all stages</p>
          </div>

          {/* Segmented bar */}
          <div className="h-3 rounded-full bg-white/[0.05] overflow-hidden flex gap-px mb-6">
            {pipelineBarSegments.map(({ status, gradient }) => {
              const count = stats.byStatus[status] ?? 0;
              const pct = (count / stats.total) * 100;
              return pct > 0 ? (
                <div
                  key={status}
                  className={clsx(
                    'bg-gradient-to-r transition-all duration-700',
                    'first:rounded-l-full last:rounded-r-full',
                    gradient
                  )}
                  style={{ width: `${pct}%` }}
                  title={`${status}: ${count} (${pct.toFixed(0)}%)`}
                />
              ) : null;
            })}
          </div>

          {/* Ring cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {pipelineRingCards.map(({ label, status, stroke, badgeBg, badgeText }, i) => {
              const count = stats.byStatus[status] ?? 0;
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div
                  key={label}
                  className="animate-slide-up"
                  style={{ animationDelay: `${380 + i * 70}ms`, animationFillMode: 'both' }}
                >
                  <RingCard
                    label={label}
                    count={count}
                    pct={pct}
                    stroke={stroke}
                    badgeBg={badgeBg}
                    badgeText={badgeText}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Source Stats + Source Breakdown ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Source stat cards */}
        <div className="lg:col-span-3">
          <h2 className="text-xs font-semibold text-indigo-400/70 uppercase tracking-widest mb-3">By Source</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sourceCards.map((card, i) => (
              <div
                key={card.label}
                className="animate-slide-up"
                style={{ animationDelay: `${(i + 5) * 60}ms`, animationFillMode: 'both' }}
              >
                <StatCard {...card} />
              </div>
            ))}
          </div>
        </div>

        {/* Source breakdown bar chart */}
        {stats.total > 0 && (
          <div
            className="lg:col-span-2 glass-card hover-pop p-5 animate-slide-up"
            style={{ animationDelay: '440ms', animationFillMode: 'both' }}
          >
            <h2 className="text-xs font-semibold text-indigo-400/70 uppercase tracking-widest mb-4">
              Source Breakdown
            </h2>
            <div className="space-y-3.5">
              {sourceMetrics.map((m) => (
                <MetricBar key={m.label} {...m} total={stats.total} />
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
