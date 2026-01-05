'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './sidebar';
import { DashboardHeader } from './dashboard-header';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleMobileMenuOpen = () => setMobileMenuOpen(true);
  const handleMobileMenuClose = () => setMobileMenuOpen(false);
  const handleSidebarToggle = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onToggle={handleSidebarToggle}
        onMobileClose={handleMobileMenuClose}
      />

      {/* Main content wrapper */}
      <div
        className="flex min-h-screen flex-col transition-[margin] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] lg:ml-[var(--sidebar-width)]"
        style={{
          // Only apply dynamic margin on desktop based on collapsed state
          marginLeft: undefined,
        }}
        data-sidebar-collapsed={sidebarCollapsed}
      >
        {/* Dynamic margin handled via CSS for better performance */}
        <style jsx>{`
          div[data-sidebar-collapsed="true"] {
            margin-left: 0;
          }
          @media (min-width: 1024px) {
            div[data-sidebar-collapsed="true"] {
              margin-left: var(--sidebar-collapsed-width);
            }
            div[data-sidebar-collapsed="false"] {
              margin-left: var(--sidebar-width);
            }
          }
        `}</style>

        {/* Header */}
        <DashboardHeader
          onMenuClick={handleMobileMenuOpen}
          sidebarCollapsed={sidebarCollapsed}
          onSidebarToggle={handleSidebarToggle}
        />

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mx-auto max-w-7xl"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
