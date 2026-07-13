import { useMemo } from 'react';
import ConfirmableSelect, { type SelectOption } from '../common/ConfirmableSelect';
import { getAllowedTransitions, isTerminalStatus } from '../../lib/statusTransitions';
import { PRIORITIES, type Priority, type Status } from '../../types/enums';
import type { TicketDetail } from '../../types/ticket';
import type { User } from '../../types/user';

type TicketInfoPanelProps = {
  ticket: TicketDetail;
  users: User[];
  usersLoading: boolean;
  disabled?: boolean;
  statusSaving: boolean;
  prioritySaving: boolean;
  assigneeSaving: boolean;
  statusError: string | null;
  priorityError: string | null;
  assigneeError: string | null;
  onStatusConfirm: (status: Status) => Promise<void>;
  onPriorityConfirm: (priority: Priority) => Promise<void>;
  onAssigneeConfirm: (assignedTo: number | null) => Promise<void>;
  formatDateTime: (iso: string) => string;
};

function assigneeValue(assignedTo: number | null): string {
  return assignedTo === null ? '' : String(assignedTo);
}

export default function TicketInfoPanel({
  ticket,
  users,
  usersLoading,
  disabled = false,
  statusSaving,
  prioritySaving,
  assigneeSaving,
  statusError,
  priorityError,
  assigneeError,
  onStatusConfirm,
  onPriorityConfirm,
  onAssigneeConfirm,
  formatDateTime,
}: TicketInfoPanelProps) {
  const statusOptions = useMemo<SelectOption[]>(() => {
    const next = getAllowedTransitions(ticket.status);
    const values = [ticket.status, ...next.filter((item) => item !== ticket.status)];

    return values.map((status) => ({ value: status, label: status }));
  }, [ticket.status]);

  const priorityOptions = useMemo<SelectOption[]>(
    () => PRIORITIES.map((priority) => ({ value: priority, label: priority })),
    [],
  );

  const assigneeOptions = useMemo<SelectOption[]>(() => {
    if (usersLoading) {
      return [{ value: assigneeValue(ticket.assignedTo), label: 'Loading users...' }];
    }

    return [
      { value: '', label: 'Unassigned' },
      ...users.map((user) => ({
        value: String(user.id),
        label: `${user.name} (${user.role})`,
      })),
    ];
  }, [users, usersLoading, ticket.assignedTo]);

  const terminal = isTerminalStatus(ticket.status);
  const fieldsDisabled = disabled || usersLoading;

  return (
    <dl className="mt-4 space-y-4 text-sm">
      <div className="flex justify-between gap-4">
        <dt className="text-slate-500">Ticket ID</dt>
        <dd className="font-medium text-slate-900">#{ticket.id}</dd>
      </div>

      <dd className="grid gap-4">
        <ConfirmableSelect
          id="ticket-info-status"
          label="Status"
          value={ticket.status}
          options={statusOptions}
          disabled={fieldsDisabled || terminal}
          saving={statusSaving}
          error={statusError ?? undefined}
          hint={
            terminal
              ? 'This ticket is in a terminal state and cannot be changed.'
              : 'Only valid next statuses are shown.'
          }
          onConfirm={async (value) => onStatusConfirm(value as Status)}
        />

        <ConfirmableSelect
          id="ticket-info-priority"
          label="Priority"
          value={ticket.priority}
          options={priorityOptions}
          disabled={fieldsDisabled}
          saving={prioritySaving}
          error={priorityError ?? undefined}
          onConfirm={async (value) => onPriorityConfirm(value as Priority)}
        />
      </dd>

      <div className="flex justify-between gap-4">
        <dt className="text-slate-500">Created by</dt>
        <dd className="font-medium text-slate-900">{ticket.createdByName}</dd>
      </div>

      <dd>
        <ConfirmableSelect
          id="ticket-info-assignee"
          label="Assignee"
          value={assigneeValue(ticket.assignedTo)}
          options={assigneeOptions}
          disabled={fieldsDisabled}
          saving={assigneeSaving}
          error={assigneeError ?? undefined}
          onConfirm={async (value) =>
            onAssigneeConfirm(value === '' ? null : Number(value))
          }
        />
      </dd>

      <div className="flex justify-between gap-4 border-t border-slate-100 pt-3">
        <dt className="text-slate-500">Created</dt>
        <dd className="text-slate-700">{formatDateTime(ticket.createdAt)}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-slate-500">Updated</dt>
        <dd className="text-slate-700">{formatDateTime(ticket.updatedAt)}</dd>
      </div>
    </dl>
  );
}
