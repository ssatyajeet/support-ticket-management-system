import type { User } from '../../types/user';

type UserSelectProps = {
  id: string;
  label: string;
  users: User[];
  value: number | '';
  onChange: (value: number | '') => void;
  loading?: boolean;
  required?: boolean;
  allowEmpty?: boolean;
  emptyLabel?: string;
  error?: string;
  disabled?: boolean;
};

const selectClassName =
  'w-full appearance-none rounded-xl border bg-white py-2.5 pl-4 pr-10 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2';

export default function UserSelect({
  id,
  label,
  users,
  value,
  onChange,
  loading = false,
  required = false,
  allowEmpty = false,
  emptyLabel = 'Unassigned',
  error,
  disabled = false,
}: UserSelectProps) {
  const isDisabled = disabled || loading;

  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </span>
      <div className="relative">
        <select
          id={id}
          value={value === '' ? '' : String(value)}
          required={required}
          disabled={isDisabled}
          onChange={(event) => {
            const next = event.target.value;

            if (!next) {
              onChange('');
              return;
            }

            onChange(Number(next));
          }}
          className={
            error
              ? `${selectClassName} border-red-300 focus:border-red-500 focus:ring-red-500/20`
              : `${selectClassName} border-slate-200 focus:border-brand-500 focus:ring-brand-500/20`
          }
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        >
          {loading ? (
            <option value="">Loading users...</option>
          ) : (
            <>
              {allowEmpty ? <option value="">{emptyLabel}</option> : null}
              {!required && !allowEmpty ? <option value="">Select a user</option> : null}
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </>
          )}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </label>
  );
}
