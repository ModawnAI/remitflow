'use client';

import { Bell, List, MagnifyingGlass, User, CaretLeft, CaretRight } from '@phosphor-icons/react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface DashboardHeaderProps {
  onMenuClick: () => void;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

export function DashboardHeader({ onMenuClick, sidebarCollapsed, onSidebarToggle }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-[var(--z-header)] flex h-16 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left section */}
      <div className="flex items-center gap-2">
        {/* Mobile menu button - visible only on mobile */}
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
          aria-label="Open menu"
        >
          <List size={24} />
        </button>

        {/* Desktop sidebar toggle - visible only on desktop */}
        {onSidebarToggle && (
          <button
            onClick={onSidebarToggle}
            className="hidden h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:flex"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <CaretRight size={20} /> : <CaretLeft size={20} />}
          </button>
        )}
      </div>

      {/* Search - centered, hidden on mobile */}
      <div className="hidden flex-1 justify-center px-4 md:flex lg:px-8">
        <div className="relative w-full max-w-md">
          <MagnifyingGlass
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            placeholder="Search transactions, users..."
            className="w-full rounded-lg border border-border bg-muted/50 py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground transition-colors focus:border-accent focus:bg-background focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Mobile search button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
          aria-label="Search"
        >
          <MagnifyingGlass size={20} />
        </button>

        {/* Notifications */}
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
        </button>

        {/* User menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors hover:bg-accent/20"
              aria-label="User menu"
            >
              <User size={20} weight="fill" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-[var(--z-dropdown)] min-w-[180px] rounded-lg border border-border bg-card p-1 shadow-lg animate-in fade-in-0 zoom-in-95"
              align="end"
              sideOffset={8}
            >
              <DropdownMenu.Item className="cursor-pointer rounded-md px-3 py-2 text-sm text-foreground outline-none transition-colors hover:bg-muted focus:bg-muted">
                Profile
              </DropdownMenu.Item>
              <DropdownMenu.Item className="cursor-pointer rounded-md px-3 py-2 text-sm text-foreground outline-none transition-colors hover:bg-muted focus:bg-muted">
                Settings
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-border" />
              <DropdownMenu.Item className="cursor-pointer rounded-md px-3 py-2 text-sm text-destructive outline-none transition-colors hover:bg-destructive/10 focus:bg-destructive/10">
                Sign Out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
