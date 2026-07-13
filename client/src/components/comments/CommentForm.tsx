import { useState, type FormEvent } from 'react';
import type { User } from '../../types/user';
import UserSelect from '../common/UserSelect';

const MESSAGE_MAX = 2000;

type CommentFormProps = {
  users: User[];
  usersLoading?: boolean;
  submitting?: boolean;
  messageError?: string;
  authorError?: string;
  submitError?: string;
  onSubmit: (message: string, createdBy: number) => void | Promise<void>;
};

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20';

export default function CommentForm({
  users,
  usersLoading = false,
  submitting = false,
  messageError,
  authorError,
  submitError,
  onSubmit,
}: CommentFormProps) {
  const [message, setMessage] = useState('');
  const [createdBy, setCreatedBy] = useState<number | ''>('');
  const [clientMessageError, setClientMessageError] = useState<string | undefined>();
  const [clientAuthorError, setClientAuthorError] = useState<string | undefined>();

  const isDisabled = submitting || usersLoading;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = message.trim();
    let valid = true;

    if (!trimmed) {
      setClientMessageError('Comment is required');
      valid = false;
    } else if (trimmed.length > MESSAGE_MAX) {
      setClientMessageError(`Comment must be at most ${MESSAGE_MAX} characters`);
      valid = false;
    } else {
      setClientMessageError(undefined);
    }

    if (!createdBy) {
      setClientAuthorError('Author is required');
      valid = false;
    } else {
      setClientAuthorError(undefined);
    }

    if (!valid || !createdBy) {
      return;
    }

    await onSubmit(trimmed, createdBy);
    setMessage('');
  }

  const resolvedMessageError = clientMessageError ?? messageError;
  const resolvedAuthorError = clientAuthorError ?? authorError;

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 border-t border-slate-100 pt-6" noValidate>
      <h3 className="text-sm font-semibold text-slate-900">Add a comment</h3>

      {submitError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {submitError}
        </p>
      ) : null}

      <div>
        <label
          htmlFor="comment-message"
          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
        >
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="comment-message"
          value={message}
          rows={4}
          maxLength={MESSAGE_MAX}
          disabled={isDisabled}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Write your comment..."
          className={
            resolvedMessageError
              ? `${inputClassName} resize-y border-red-300 focus:border-red-500 focus:ring-red-500/20`
              : `${inputClassName} resize-y`
          }
          aria-invalid={resolvedMessageError ? true : undefined}
        />
        {resolvedMessageError ? (
          <p className="mt-1.5 text-sm text-red-600">{resolvedMessageError}</p>
        ) : null}
      </div>

      <UserSelect
        id="comment-author"
        label="Author"
        users={users}
        value={createdBy}
        onChange={setCreatedBy}
        loading={usersLoading}
        required
        disabled={isDisabled}
        error={resolvedAuthorError}
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isDisabled}
          className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-brand-600/25 transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Posting...' : 'Post comment'}
        </button>
      </div>
    </form>
  );
}
