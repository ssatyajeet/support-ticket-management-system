import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isApiError } from '../api/client';
import { createTicket } from '../api/tickets';
import ErrorAlert from '../components/common/ErrorAlert';
import PageHeader from '../components/common/PageHeader';
import TicketForm, { type TicketFormValues } from '../components/tickets/TicketForm';
import { IconChevronRight } from '../components/icons';
import { useUsers } from '../hooks/useUsers';

function mapApiFieldErrors(
  details: { field: string; message: string }[] | undefined,
): Partial<Record<keyof TicketFormValues, string>> {
  if (!details?.length) {
    return {};
  }

  const mapped: Partial<Record<keyof TicketFormValues, string>> = {};

  for (const detail of details) {
    if (
      detail.field === 'title' ||
      detail.field === 'description' ||
      detail.field === 'priority' ||
      detail.field === 'createdBy' ||
      detail.field === 'assignedTo'
    ) {
      mapped[detail.field] = detail.message;
    }
  }

  return mapped;
}

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof TicketFormValues, string>>
  >({});

  async function handleSubmit(values: TicketFormValues) {
    if (!values.createdBy) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setFieldErrors({});

    try {
      const ticket = await createTicket({
        title: values.title,
        description: values.description,
        priority: values.priority,
        createdBy: values.createdBy,
        assignedTo: values.assignedTo === '' ? null : values.assignedTo,
      });

      navigate(`/tickets/${ticket.id}`);
    } catch (err: unknown) {
      if (isApiError(err)) {
        setSubmitError(err.message);
        setFieldErrors(mapApiFieldErrors(err.details));
      } else if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError('Failed to create ticket');
      }
    } finally {
      setSubmitting(false);
    }
  }

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

      {usersError ? <ErrorAlert message={usersError} /> : null}
      {submitError ? <ErrorAlert message={submitError} /> : null}

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
        <TicketForm
          users={users}
          usersLoading={usersLoading}
          submitting={submitting}
          fieldErrors={fieldErrors}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/')}
        />
      </div>
    </section>
  );
}
