import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { isApiError } from '../api/client';
import { createComment } from '../api/comments';
import { changeTicketStatus, updateTicket } from '../api/tickets';
import CommentForm from '../components/comments/CommentForm';
import CommentList from '../components/comments/CommentList';
import Button from '../components/common/Button';
import ErrorAlert from '../components/common/ErrorAlert';
import PageHeader from '../components/common/PageHeader';
import { IconChevronRight, IconTicket } from '../components/icons';
import PriorityBadge from '../components/tickets/PriorityBadge';
import StatusBadge from '../components/tickets/StatusBadge';
import TicketForm, {
  type TicketFormInitialValues,
  type TicketFormValues,
} from '../components/tickets/TicketForm';
import TicketInfoPanel from '../components/tickets/TicketInfoPanel';
import { useTicket } from '../hooks/useTicket';
import { useUsers } from '../hooks/useUsers';
import type { Priority, Status } from '../types/enums';

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function parseTicketId(rawId: string | undefined): number | null {
  if (!rawId) {
    return null;
  }

  const parsed = Number(rawId);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function mapApiFieldErrors(
  details: { field: string; message: string }[] | undefined,
): Partial<Record<keyof TicketFormValues, string>> {
  if (!details?.length) {
    return {};
  }

  const mapped: Partial<Record<keyof TicketFormValues, string>> = {};

  for (const detail of details) {
    if (detail.field === 'title' || detail.field === 'description') {
      mapped[detail.field] = detail.message;
    }
  }

  return mapped;
}

function TicketDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true">
      <div className="h-8 w-1/3 rounded-lg bg-slate-200" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-48 rounded-2xl bg-slate-100 lg:col-span-2" />
        <div className="h-64 rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}

export default function TicketDetailPage() {
  const { id: rawId } = useParams<{ id: string }>();
  const ticketId = parseTicketId(rawId);
  const { ticket, loading, error, notFound, refetch } = useTicket(ticketId);
  const { users, loading: usersLoading, error: usersError } = useUsers();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editFieldErrors, setEditFieldErrors] = useState<
    Partial<Record<keyof TicketFormValues, string>>
  >({});

  const [statusSaving, setStatusSaving] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const [prioritySaving, setPrioritySaving] = useState(false);
  const [priorityError, setPriorityError] = useState<string | null>(null);

  const [assigneeSaving, setAssigneeSaving] = useState(false);
  const [assigneeError, setAssigneeError] = useState<string | null>(null);

  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [commentMessageError, setCommentMessageError] = useState<string | undefined>();
  const [commentAuthorError, setCommentAuthorError] = useState<string | undefined>();

  const editInitialValues = useMemo<TicketFormInitialValues | undefined>(() => {
    if (!ticket) {
      return undefined;
    }

    return {
      title: ticket.title,
      description: ticket.description,
    };
  }, [ticket]);

  const sidebarDisabled = isEditing || saving || statusSaving || prioritySaving || assigneeSaving;

  async function handleSaveEdit(values: TicketFormValues) {
    if (!ticket) {
      return;
    }

    setSaving(true);
    setSaveError(null);
    setEditFieldErrors({});

    try {
      await updateTicket(ticket.id, {
        title: values.title,
        description: values.description,
      });

      setIsEditing(false);
      refetch();
    } catch (err: unknown) {
      if (isApiError(err)) {
        setSaveError(err.message);
        setEditFieldErrors(mapApiFieldErrors(err.details));
      } else if (err instanceof Error) {
        setSaveError(err.message);
      } else {
        setSaveError('Failed to update ticket');
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusConfirm(nextStatus: Status) {
    if (!ticket || nextStatus === ticket.status) {
      return;
    }

    setStatusSaving(true);
    setStatusError(null);

    try {
      await changeTicketStatus(ticket.id, { status: nextStatus });
      refetch();
    } catch (err: unknown) {
      if (isApiError(err)) {
        setStatusError(err.message);
      } else if (err instanceof Error) {
        setStatusError(err.message);
      } else {
        setStatusError('Failed to change status');
      }

      throw err;
    } finally {
      setStatusSaving(false);
    }
  }

  async function handlePriorityConfirm(nextPriority: Priority) {
    if (!ticket || nextPriority === ticket.priority) {
      return;
    }

    setPrioritySaving(true);
    setPriorityError(null);

    try {
      await updateTicket(ticket.id, { priority: nextPriority });
      refetch();
    } catch (err: unknown) {
      if (isApiError(err)) {
        setPriorityError(err.message);
      } else if (err instanceof Error) {
        setPriorityError(err.message);
      } else {
        setPriorityError('Failed to update priority');
      }

      throw err;
    } finally {
      setPrioritySaving(false);
    }
  }

  async function handleAssigneeConfirm(assignedTo: number | null) {
    if (!ticket || assignedTo === ticket.assignedTo) {
      return;
    }

    setAssigneeSaving(true);
    setAssigneeError(null);

    try {
      await updateTicket(ticket.id, { assignedTo });
      refetch();
    } catch (err: unknown) {
      if (isApiError(err)) {
        setAssigneeError(err.message);
      } else if (err instanceof Error) {
        setAssigneeError(err.message);
      } else {
        setAssigneeError('Failed to update assignee');
      }

      throw err;
    } finally {
      setAssigneeSaving(false);
    }
  }

  async function handleAddComment(message: string, createdBy: number) {
    if (!ticket) {
      return;
    }

    setCommentSubmitting(true);
    setCommentError(null);
    setCommentMessageError(undefined);
    setCommentAuthorError(undefined);

    try {
      await createComment(ticket.id, { message, createdBy });
      refetch();
    } catch (err: unknown) {
      if (isApiError(err)) {
        setCommentError(err.message);

        for (const detail of err.details ?? []) {
          if (detail.field === 'message') {
            setCommentMessageError(detail.message);
          }

          if (detail.field === 'createdBy') {
            setCommentAuthorError(detail.message);
          }
        }
      } else if (err instanceof Error) {
        setCommentError(err.message);
      } else {
        setCommentError('Failed to post comment');
      }
    } finally {
      setCommentSubmitting(false);
    }
  }

  if (loading) {
    return (
      <section className="space-y-6">
        <TicketDetailSkeleton />
      </section>
    );
  }

  if (notFound || !ticket) {
    return (
      <section className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="rounded-3xl border border-slate-200/80 bg-white px-10 py-12 shadow-sm">
          <p className="text-6xl font-bold tracking-tight text-slate-200">404</p>
          <PageHeader
            title="Ticket not found"
            description={
              error ??
              `Ticket #${rawId ?? ''} does not exist or may have been removed.`
            }
          />
          <div className="mt-8">
            <Button to="/">Back to tickets</Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-brand-600">
          Back to Tickets
        </Link>
        <IconChevronRight className="h-4 w-4" />
        <span className="text-slate-700">#{ticket.id}</span>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader title={ticket.title} description={`Ticket #${ticket.id}`} />
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
          {!isEditing ? (
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setSaveError(null);
                setEditFieldErrors({});
              }}
              disabled={sidebarDisabled}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Edit
            </button>
          ) : null}
        </div>
      </div>

      {error ? <ErrorAlert message={error} /> : null}
      {usersError ? <ErrorAlert message={usersError} /> : null}
      {saveError ? <ErrorAlert message={saveError} /> : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {isEditing ? 'Edit title & description' : 'Description'}
            </h2>

            {isEditing && editInitialValues ? (
              <div className="mt-4">
                <TicketForm
                  key={ticket.updatedAt}
                  mode="edit"
                  initialValues={editInitialValues}
                  users={users}
                  usersLoading={usersLoading}
                  submitting={saving}
                  fieldErrors={editFieldErrors}
                  onSubmit={handleSaveEdit}
                  onCancel={() => {
                    setIsEditing(false);
                    setSaveError(null);
                    setEditFieldErrors({});
                  }}
                />
              </div>
            ) : (
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {ticket.description}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Comments ({ticket.comments.length})
            </h2>
            <div className="mt-4">
              <CommentList comments={ticket.comments} />
            </div>
            <CommentForm
              users={users}
              usersLoading={usersLoading}
              submitting={commentSubmitting}
              submitError={commentError ?? undefined}
              messageError={commentMessageError}
              authorError={commentAuthorError}
              onSubmit={handleAddComment}
            />
          </div>
        </div>

        <aside>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              <IconTicket className="h-4 w-4" />
              Ticket Information
            </h2>
            <TicketInfoPanel
              ticket={ticket}
              users={users}
              usersLoading={usersLoading}
              disabled={sidebarDisabled}
              statusSaving={statusSaving}
              prioritySaving={prioritySaving}
              assigneeSaving={assigneeSaving}
              statusError={statusError}
              priorityError={priorityError}
              assigneeError={assigneeError}
              onStatusConfirm={handleStatusConfirm}
              onPriorityConfirm={handlePriorityConfirm}
              onAssigneeConfirm={handleAssigneeConfirm}
              formatDateTime={formatDateTime}
            />
          </div>
        </aside>
      </div>
    </section>
  );
}
