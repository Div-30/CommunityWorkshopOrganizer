import { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileMenu } from './MobileMenu';

export function PageWrapper({ children, title, subtitle, action, role = 'attendee' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Desktop sidebar */}
      <Sidebar role={role} />

      {/* Mobile navbar */}
      <Navbar onOpenMenu={() => setMobileMenuOpen(true)} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} role={role} />

      {/* Main content area — offset by sidebar width on desktop */}
      <main className="lg:pl-[240px]">
        <div className="mx-auto max-w-[1180px] px-6 py-8 lg:px-8 lg:py-10">
          <div className="page-enter">
            {/* Page header */}
            {(title || action) && (
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  {title && (
                    <h1 className="text-[28px] font-semibold tracking-tight text-[var(--color-ink)]">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="mt-1.5 text-[15px] text-[var(--color-ink-secondary)]">
                      {subtitle}
                    </p>
                  )}
                </div>
                {action && <div className="shrink-0">{action}</div>}
              </div>
            )}

            {/* Page content */}
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
