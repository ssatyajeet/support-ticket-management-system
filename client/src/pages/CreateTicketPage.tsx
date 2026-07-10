import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import PageHeader from '../components/common/PageHeader';
import { IconChevronRight, IconPlus, IconTicket } from '../components/icons';

export default function CreateTicketPage() {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-brand-600">
          Tickets
        </Link>
        <IconChevronRight className="h-4 w-4" />
        <span className="text-slate-700">Create</span>
      </div>

      <PageHeader
        title="Create New Ticket"
        description="Log a new support request for your team to triage and resolve."
      />

      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
        <div className="mx-auto max-w-lg text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <IconPlus className="h-7 w-7" />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-slate-900">Ticket form coming soon</h2>
          <p className="mt-2 text-sm text-slate-600">
            The full create-ticket form with title, priority, description, and assignee
            fields will be implemented in Sprint 4.3.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button to="/" variant="secondary">
              Back to tickets
            </Button>
            <Button to="/dashboard" variant="ghost">
              <IconTicket className="h-4 w-4" />
              Dashboard
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
