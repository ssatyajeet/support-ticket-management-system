import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { IconDashboard, IconPlus, IconTicket, IconTickets } from '../icons';
import Sidebar from './Sidebar';

const mobileLinks = [
  { to: '/dashboard', label: 'Home', icon: IconDashboard },
  { to: '/', label: 'Tickets', icon: IconTickets, end: true },
  { to: '/tickets/new', label: 'Create', icon: IconPlus },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 transition-transform lg:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Open navigation"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <IconTicket className="h-4 w-4" />
            </span>
            Support Desk
          </span>
          <div className="w-10" />
        </header>

        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white px-2 py-2 lg:hidden">
          <ul className="flex justify-around">
            {mobileLinks.map((link) => {
              const Icon = link.icon;

              return (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      cn(
                        'flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs font-medium',
                        isActive ? 'text-brand-600' : 'text-slate-500',
                      )
                    }
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
