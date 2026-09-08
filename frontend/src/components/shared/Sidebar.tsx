'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShieldAlert, FileSearch, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analyze Transaction', href: '/transactions/analyze', icon: FileSearch },
  { name: 'Fraud Alerts', href: '/alerts', icon: ShieldAlert },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white px-4 py-6 shadow-sm">
      <div className="flex items-center gap-2 px-2 mb-8 text-blue-900">
        <ShieldCheck className="h-8 w-8 text-blue-600" />
        <span className="text-xl font-bold tracking-tight">SecureBank</span>
      </div>
      
      <div className="text-xs font-semibold text-slate-400 mb-4 px-2 uppercase tracking-wider">
        Privacy-Preserving AI
      </div>

      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href) || (pathname === '/' && item.href === '/dashboard');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 flex-shrink-0',
                  isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t pt-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
            BA
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-900">Bank Admin</span>
            <span className="text-xs text-slate-500">Security Dept</span>
          </div>
        </div>
      </div>
    </div>
  );
}
