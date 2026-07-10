import { Link } from 'react-router-dom';
import DonutChart, { type DonutSegment } from '../components/charts/DonutChart';
import StatCard from '../components/charts/StatCard';
import ErrorAlert from '../components/common/ErrorAlert';
import PageHeader from '../components/common/PageHeader';
import {
  IconChevronRight,
  IconTicket,
  IconTickets,
} from '../components/icons';
import StatusBadge from '../components/tickets/StatusBadge';
import { useDashboardData } from '../hooks/useDashboard';
import type { Status } from '../types/enums';

const statusChartColors: Record<Status, string> = {
  Open: '#38bdf8',
  'In Progress': '#fbbf24',
  Resolved: '#34d399',
  Closed: '#94a3b8',
  Cancelled: '#fb7185',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function DashboardPage() {
  const { stats, recentTickets, loading, error } = useDashboardData();

  const chartSegments: DonutSegment[] = (
    Object.keys(statusChartColors) as Status[]
  ).map((status) => ({
    label: status,
    value: stats[status],
    color: statusChartColors[status],
  }));

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Overview of your support queue." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-28 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of ticket volume, status distribution, and recent activity."
      />

      {error ? <ErrorAlert message={error} /> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Tickets"
          value={stats.all}
          accent="brand"
          icon={<IconTickets className="h-5 w-5" />}
        />
        <StatCard
          label="Open"
          value={stats.Open}
          accent="sky"
          icon={<IconTicket className="h-5 w-5" />}
        />
        <StatCard
          label="In Progress"
          value={stats['In Progress']}
          accent="amber"
          icon={<IconTicket className="h-5 w-5" />}
        />
        <StatCard
          label="Resolved"
          value={stats.Resolved}
          accent="emerald"
          icon={<IconTicket className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Tickets by Status</h2>
          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <DonutChart segments={chartSegments} />
            <ul className="w-full space-y-2 sm:flex-1">
              {chartSegments.map((segment) => (
                <li
                  key={segment.label}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
                >
                  <span className="flex items-center gap-2 text-slate-700">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    />
                    {segment.label}
                  </span>
                  <span className="font-semibold text-slate-900">{segment.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Tickets</h2>
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              View all
              <IconChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="pb-3 pr-4 font-semibold">ID</th>
                  <th className="pb-3 pr-4 font-semibold">Title</th>
                  <th className="pb-3 pr-4 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/80">
                    <td className="py-3 pr-4 font-medium text-slate-500">#{ticket.id}</td>
                    <td className="py-3 pr-4">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="font-medium text-slate-900 hover:text-brand-600"
                      >
                        {ticket.title}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="py-3 text-slate-500">{formatDate(ticket.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentTickets.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">No tickets yet.</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 p-6 text-white shadow-lg shadow-brand-600/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Need to log a new issue?</h3>
            <p className="mt-1 text-sm text-brand-100">
              Create a ticket and assign it to your support team.
            </p>
          </div>
          <Link
            to="/tickets/new"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 shadow-sm hover:bg-brand-50"
          >
            Create Ticket
            <IconChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
