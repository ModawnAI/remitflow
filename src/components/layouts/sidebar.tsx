'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  House,
  ArrowsLeftRight,
  IdentificationCard,
  Users,
  ChartLine,
  Gear,
  CaretLeft,
  CaretRight,
  SignOut,
  CurrencyGbp,
  X,
} from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
}

interface NavItem {
  label: string;
  path: Route;
  icon: Icon;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard' as Route, icon: House },
  { label: 'Transactions', path: '/transactions' as Route, icon: ArrowsLeftRight },
  { label: 'KYC Review', path: '/kyc' as Route, icon: IdentificationCard, badge: 'pendingCount' },
  { label: 'Users', path: '/users' as Route, icon: Users },
  { label: 'Reports', path: '/reports' as Route, icon: ChartLine },
  { label: 'Settings', path: '/settings' as Route, icon: Gear },
];

// Sidebar animation variants
const sidebarVariants = {
  expanded: { width: 'var(--sidebar-width)' },
  collapsed: { width: 'var(--sidebar-collapsed-width)' },
};

const mobileVariants = {
  open: { x: 0 },
  closed: { x: '-100%' },
};

const overlayVariants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};

export function Sidebar({ collapsed, mobileOpen, onToggle, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  // Shared sidebar content
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => {
    const showLabels = isMobile ? true : !collapsed;

    return (
      <>
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
          <Link href={'/dashboard' as Route} className="flex items-center gap-3" onClick={isMobile ? onMobileClose : undefined}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-secondary text-accent-foreground shadow-accent">
              <CurrencyGbp size={24} weight="bold" />
            </div>
            <AnimatePresence mode="wait">
              {showLabels && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap text-lg font-semibold text-foreground"
                >
                  RemitFlow
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Desktop: Collapse toggle | Mobile: Close button */}
          {isMobile ? (
            <button
              onClick={onMobileClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          ) : (
            <button
              onClick={onToggle}
              className="hidden h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:flex"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <CaretRight size={18} /> : <CaretLeft size={18} />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
              const IconComponent = item.icon;

              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={isMobile ? onMobileClose : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-accent/10 text-accent'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      !showLabels && 'justify-center'
                    )}
                    title={!showLabels ? item.label : undefined}
                  >
                    <IconComponent
                      size={20}
                      weight={isActive ? 'fill' : 'regular'}
                      className={cn('shrink-0', isActive ? 'text-accent' : 'text-muted-foreground')}
                    />
                    <AnimatePresence mode="wait">
                      {showLabels && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {showLabels && item.badge && (
                      <span className="ml-auto flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 px-1.5 text-xs font-semibold text-accent">
                        3
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="shrink-0 border-t border-border p-3">
          <button
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground',
              !showLabels && 'justify-center'
            )}
            title={!showLabels ? 'Sign Out' : undefined}
          >
            <SignOut size={20} className="shrink-0 text-muted-foreground" />
            <AnimatePresence mode="wait">
              {showLabels && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <motion.aside
        variants={sidebarVariants}
        initial={false}
        animate={collapsed ? 'collapsed' : 'expanded'}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed left-0 top-0 z-[var(--z-sidebar)] hidden h-screen flex-col border-r border-border bg-card lg:flex"
      >
        <SidebarContent isMobile={false} />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.2 }}
            onClick={onMobileClose}
            className="fixed inset-0 z-[var(--z-sidebar-overlay)] bg-foreground/20 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Drawer */}
      <motion.aside
        variants={mobileVariants}
        initial="closed"
        animate={mobileOpen ? 'open' : 'closed'}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed left-0 top-0 z-[var(--z-sidebar)] flex h-screen w-[var(--sidebar-width)] flex-col border-r border-border bg-card lg:hidden"
      >
        <SidebarContent isMobile={true} />
      </motion.aside>
    </>
  );
}
