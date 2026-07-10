import { STATUSES, type Status } from '../../types/enums';

type StatusFilterProps = {
  value: Status | '';
  onChange: (value: Status | '') => void;
};

export default function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
        Status
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as Status | '')}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        >
          <option value="">All statuses</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
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
    </label>
  );
}
