import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/cn';
import {
  IconDashboard,
  IconPlus,
  IconTicket,
  IconTickets,
  IconUser,
} from '../icons';

type NavItem = {
  to: string;
  label: string;
  icon: ReactNode;
  end?: boolean;
};

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: <IconDashboard className="h-5 w-5" /> },
  { to: '/', label: 'All Tickets', icon: <IconTickets className="h-5 w-5" />, end: true },
  { to: '/tickets/new', label: 'Create Ticket', icon: <IconPlus className="h-5 w-5" /> },
];

type SidebarProps = {
  onNavigate?: () => void;
};

export default function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-sidebar">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/25">
          <IconTicket className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold text-slate-900">Support Desk</p>
          <p className="text-xs text-slate-500">Ticket Management</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <IconUser className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">Support Agent</p>
            <p className="truncate text-xs text-slate-500">Agent</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
