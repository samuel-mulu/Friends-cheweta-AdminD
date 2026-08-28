'use client';
import { QueryProvider } from '@/lib/query/query-provider';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { AuthProvider } from '@/features/auth/auth-provider';
export function Providers({ children }: { children: React.ReactNode }) { return <ThemeProvider><QueryProvider><AuthProvider>{children}</AuthProvider></QueryProvider></ThemeProvider>; }
