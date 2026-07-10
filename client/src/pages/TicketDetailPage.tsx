import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { IconChevronRight, IconTicket } from '../components/icons';

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-brand-600">
          Back to Tickets
        </Link>
        <IconChevronRight className="h-4 w-4" />
        <span className="text-slate-700">#{id}</span>
      </div>

      <PageHeader
        title="Unable to load ticket details"
        description="View and manage ticket details, status transitions, and comments."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Description
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Ticket detail view with comments and status actions will be implemented in
              Sprint 4.3.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Comments
            </h2>
            <p className="mt-3 text-sm text-slate-500">No comments yet.</p>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <IconTicket className="h-4 w-4" />
            Ticket Information
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Ticket ID</dt>
              <dd className="font-medium text-slate-900">#{id}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Status</dt>
              <dd className="font-medium text-slate-900">—</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Assignee</dt>
              <dd className="font-medium text-slate-400">Unassigned</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
