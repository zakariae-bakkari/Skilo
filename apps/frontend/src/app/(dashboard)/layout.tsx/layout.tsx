import { ReactNode } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F5F3FF]">
        {children}
      </div>
    </ProtectedRoute>
  )
}
