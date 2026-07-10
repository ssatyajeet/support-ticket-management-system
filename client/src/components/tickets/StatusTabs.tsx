import { cn } from '../../lib/cn';
import type { TicketCounts } from '../../hooks/useDashboard';
import { STATUSES, type Status } from '../../types/enums';

type StatusTabsProps = {
  activeStatus: Status | '';
  counts: TicketCounts;
  onChange: (status: Status | '') => void;
};

export default function StatusTabs({ activeStatus, counts, onChange }: StatusTabsProps) {
  const tabs: { label: string; value: Status | '' }[] = [
    { label: 'All', value: '' },
    ...STATUSES.map((status) => ({ label: status, value: status })),
  ];

  return (
    <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
      {tabs.map((tab) => {
        const isActive = activeStatus === tab.value;
        const count = tab.value === '' ? counts.all : counts[tab.value];

        return (
          <button
            key={tab.label}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition',
              isActive
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50',
            )}
          >
            {tab.label}
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-semibold',
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600',
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
