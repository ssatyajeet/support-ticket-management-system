import { IconSearch } from '../icons';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
        Search
      </span>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
          <IconSearch className="h-4 w-4" />
        </span>
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search title or description..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>
    </label>
  );
}
