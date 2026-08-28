import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
export const metadata: Metadata = { title: 'Friends Game Hub Admin', description: 'Operations console for Friends Game Hub' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang='en' suppressHydrationWarning><body className={inter.className}><Providers>{children}</Providers></body></html>; }
