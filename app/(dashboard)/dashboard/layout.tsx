'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Users, Settings, Shield, Activity, Menu, Receipt, FileText, X, FileCheck } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', icon: Users, label: 'Team', exact: true },
    { href: '/dashboard/quotation', icon: FileText, label: 'Quotation', exact: false },
    { href: '/dashboard/invoice', icon: Receipt, label: 'Invoice', exact: false },
    { href: '/dashboard/receipt', icon: FileCheck, label: 'Receipt', exact: false },
    { href: '/dashboard/general', icon: Settings, label: 'General', exact: false },
    { href: '/dashboard/activity', icon: Activity, label: 'Activity', exact: false },
    { href: '/dashboard/security', icon: Shield, label: 'Security', exact: false },
  ];

  useEffect(() => {
    // Close sidebar on route change on mobile
    setIsSidebarOpen(false);
  }, [pathname]);

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col min-h-[calc(100dvh-68px)] max-w-7xl mx-auto w-full">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b border-gray-200 p-4">
        <div className="flex items-center">
          <span className="font-medium">Dashboard</span>
        </div>
        <Button
          className="-mr-3"
          variant="ghost"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden h-full">
        {/* Sidebar */}
        <aside
          className={`w-64 bg-white lg:bg-gray-50 border-r border-gray-200 lg:block fixed lg:static top-[68px] bottom-0 z-40 ${
            isSidebarOpen ? 'block' : 'hidden'
          } transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className="h-full overflow-y-auto p-4">
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
              <Link key={item.href} href={item.href} passHref>
                <Button
                  variant={active ? 'secondary' : 'ghost'}
                  className={`shadow-none my-1 w-full justify-start ${
                    active ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            )})}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-0 lg:p-4 lg:ml-0">{children}</main>
      </div>
    </div>
  );
}
