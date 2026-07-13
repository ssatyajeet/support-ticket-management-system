import { cn } from '../../lib/cn';
import { getAllowedTransitions, isTerminalStatus } from '../../lib/statusTransitions';
import type { Status } from '../../types/enums';

type StatusSelectorProps = {
  currentStatus: Status;
  onSelect: (nextStatus: Status) => void;
  disabled?: boolean;
  error?: string;
};

export default function StatusSelector({
  currentStatus,
  onSelect,
  disabled = false,
  error,
}: StatusSelectorProps) {
  const allowed = getAllowedTransitions(currentStatus);
  const terminal = isTerminalStatus(currentStatus);

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Change status
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {terminal
            ? 'This ticket is in a terminal state and cannot be changed.'
            : 'Select a valid next status. The server enforces transition rules.'}
        </p>
      </div>

      {allowed.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {allowed.map((status) => (
            <button
              key={status}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(status)}
              className={cn(
                'rounded-xl border px-3 py-2 text-sm font-medium transition',
                'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700',
                'disabled:cursor-not-allowed disabled:opacity-60',
              )}
            >
              → {status}
            </button>
          ))}
        </div>
      ) : null}

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
