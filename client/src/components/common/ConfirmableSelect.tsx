import { useEffect, useState } from 'react';
import { cn } from '../../lib/cn';

export type SelectOption = {
  value: string;
  label: string;
};

type ConfirmableSelectProps = {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  disabled?: boolean;
  saving?: boolean;
  error?: string;
  hint?: string;
  onConfirm: (value: string) => Promise<void>;
};

const selectClassName =
  'w-full appearance-none rounded-xl border bg-white py-2 pl-3 pr-9 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2';

export default function ConfirmableSelect({
  id,
  label,
  value,
  options,
  disabled = false,
  saving = false,
  error,
  hint,
  onConfirm,
}: ConfirmableSelectProps) {
  const [draft, setDraft] = useState(value);
  const isDisabled = disabled || saving;
  const hasPendingChange = draft !== value;

  useEffect(() => {
    setDraft(value);
  }, [value]);

  function handleCancel() {
    setDraft(value);
  }

  async function handleConfirm() {
    await onConfirm(draft);
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-slate-500">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={draft}
          disabled={isDisabled}
          onChange={(event) => setDraft(event.target.value)}
          className={cn(
            selectClassName,
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20',
            isDisabled && 'cursor-not-allowed opacity-60',
          )}
          aria-invalid={error ? true : undefined}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-slate-400">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>

      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}

      {hasPendingChange ? (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-600">Save this change?</span>
          <button
            type="button"
            disabled={saving}
            onClick={handleConfirm}
            className="rounded-lg bg-brand-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleCancel}
            className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      ) : null}

      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
