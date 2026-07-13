import { useEffect, useState, type FormEvent } from 'react';
import { PRIORITIES, type Priority } from '../../types/enums';
import type { User } from '../../types/user';
import UserSelect from '../common/UserSelect';

const TITLE_MAX = 200;
const DESCRIPTION_MAX = 5000;

export type TicketFormValues = {
  title: string;
  description: string;
  priority: Priority;
  createdBy: number | '';
  assignedTo: number | '';
};

export type TicketFormInitialValues = {
  title: string;
  description: string;
  priority?: Priority;
  assignedTo?: number | null;
};

type TicketFormProps = {
  mode?: 'create' | 'edit';
  initialValues?: TicketFormInitialValues;
  users: User[];
  usersLoading?: boolean;
  submitting?: boolean;
  submitLabel?: string;
  fieldErrors?: Partial<Record<keyof TicketFormValues | 'assignedTo' | 'createdBy', string>>;
  onSubmit: (values: TicketFormValues) => void | Promise<void>;
  onCancel?: () => void;
};

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20';

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-1.5 text-sm text-red-600">{message}</p>;
}

export default function TicketForm({
  mode = 'create',
  initialValues,
  users,
  usersLoading = false,
  submitting = false,
  submitLabel,
  fieldErrors = {},
  onSubmit,
  onCancel,
}: TicketFormProps) {
  const isEdit = mode === 'edit';
  const resolvedSubmitLabel = submitLabel ?? (isEdit ? 'Save changes' : 'Create Ticket');

  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [priority, setPriority] = useState<Priority>(initialValues?.priority ?? 'Medium');
  const [createdBy, setCreatedBy] = useState<number | ''>('');
  const [assignedTo, setAssignedTo] = useState<number | ''>(
    initialValues?.assignedTo ?? '',
  );
  const [clientErrors, setClientErrors] = useState<
    Partial<Record<keyof TicketFormValues, string>>
  >({});

  useEffect(() => {
    if (!initialValues) {
      return;
    }

    setTitle(initialValues.title);
    setDescription(initialValues.description);

    if (!isEdit) {
      setPriority(initialValues.priority ?? 'Medium');
      setAssignedTo(initialValues.assignedTo ?? '');
    }

    setClientErrors({});
  }, [initialValues, isEdit]);

  function validate(): boolean {
    const nextErrors: Partial<Record<keyof TicketFormValues, string>> = {};
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      nextErrors.title = 'Title is required';
    } else if (trimmedTitle.length > TITLE_MAX) {
      nextErrors.title = `Title must be at most ${TITLE_MAX} characters`;
    }

    if (!trimmedDescription) {
      nextErrors.description = 'Description is required';
    } else if (trimmedDescription.length > DESCRIPTION_MAX) {
      nextErrors.description = `Description must be at most ${DESCRIPTION_MAX} characters`;
    }

    if (!isEdit && !createdBy) {
      nextErrors.createdBy = 'Created by is required';
    }

    setClientErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      createdBy: isEdit ? '' : createdBy,
      assignedTo,
    });
  }

  const errors = { ...clientErrors, ...fieldErrors };
  const isDisabled = submitting || usersLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="ticket-title" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="ticket-title"
          type="text"
          value={title}
          maxLength={TITLE_MAX}
          disabled={isDisabled}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Brief summary of the issue"
          className={
            errors.title
              ? `${inputClassName} border-red-300 focus:border-red-500 focus:ring-red-500/20`
              : inputClassName
          }
          aria-invalid={errors.title ? true : undefined}
        />
        <FieldError message={errors.title} />
      </div>

      <div>
        <label
          htmlFor="ticket-description"
          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
        >
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="ticket-description"
          value={description}
          maxLength={DESCRIPTION_MAX}
          rows={6}
          disabled={isDisabled}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe the issue in detail..."
          className={
            errors.description
              ? `${inputClassName} resize-y border-red-300 focus:border-red-500 focus:ring-red-500/20`
              : `${inputClassName} resize-y`
          }
          aria-invalid={errors.description ? true : undefined}
        />
        <FieldError message={errors.description} />
      </div>

      <div className={isEdit ? 'hidden' : 'grid gap-5 sm:grid-cols-2'}>
        <div>
          <label
            htmlFor="ticket-priority"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            Priority <span className="text-red-500">*</span>
          </label>
          <select
            id="ticket-priority"
            value={priority}
            disabled={isDisabled}
            onChange={(event) => setPriority(event.target.value as Priority)}
            className={inputClassName}
          >
            {PRIORITIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <FieldError message={errors.priority} />
        </div>

        {!isEdit ? (
          <UserSelect
            id="ticket-created-by"
            label="Created by"
            users={users}
            value={createdBy}
            onChange={setCreatedBy}
            loading={usersLoading}
            required
            disabled={isDisabled}
            error={errors.createdBy}
          />
        ) : null}
      </div>

      {!isEdit ? (
        <UserSelect
          id="ticket-assigned-to"
          label="Assignee"
          users={users}
          value={assignedTo}
          onChange={setAssignedTo}
          loading={usersLoading}
          allowEmpty
          emptyLabel="Unassigned"
          disabled={isDisabled}
          error={errors.assignedTo}
        />
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-5">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            disabled={isDisabled}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        ) : null}
        <button
          type="submit"
          disabled={isDisabled}
          className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-brand-600/25 transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving...' : resolvedSubmitLabel}
        </button>
      </div>
    </form>
  );
}
