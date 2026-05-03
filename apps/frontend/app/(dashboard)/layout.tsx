'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { SidebarProvider } from '@/components/ui/sidebar';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoading }           = useAuth();
  const router                        = useRouter();

  // Redirect if not authenticated or not onboarded
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    } else if (!isLoading && user && !user.isOnboarded) {
      router.replace('/onboarding');
    }
  }, [user, isLoading, router]);

  // Listen for session expiry
  useEffect(() => {
    function handle() { router.replace('/login'); }
    window.addEventListener('skilo:session-expired', handle);
    return () => window.removeEventListener('skilo:session-expired', handle);
  }, [router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Chargement…</span>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="h-screen flex bg-background overflow-hidden w-full">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuClick={() => setSidebarOpen((o) => !o)} />
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
