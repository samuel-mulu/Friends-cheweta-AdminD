import { AuthGate } from '@/features/auth/auth-gate'; import { AdminShell } from '@/components/layout/admin-shell';
export default function DashboardLayout({children}:{children:React.ReactNode}){return <AuthGate><AdminShell>{children}</AdminShell></AuthGate>}
