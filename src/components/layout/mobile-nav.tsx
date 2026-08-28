'use client';
import Link from 'next/link';
import { BarChart3, Users, WalletCards, Swords, Activity } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
export function MobileNav(){const path=usePathname();const items=[['/overview','Overview',BarChart3],['/players','Players',Users],['/wallet-transactions','Finance',WalletCards],['/matches','Matches',Swords],['/realtime','Live',Activity]] as const;return <nav className='fixed inset-x-0 bottom-0 z-40 flex border-t bg-card/95 p-2 backdrop-blur lg:hidden'>{items.map(([href,label,Icon])=><Link key={href} href={href} className={cn('flex flex-1 flex-col items-center gap-1 rounded-lg py-2 text-xs font-medium',path.startsWith(href)?'text-primary':'text-muted-foreground')}><Icon className='h-5 w-5'/>{label}</Link>)}</nav>}
