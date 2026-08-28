import Link from 'next/link';
import { Button } from '@/components/ui/button';
export default function NotFound(){return <main className='grid min-h-screen place-items-center bg-background p-6'><div className='text-center'><div className='text-sm font-semibold text-primary'>404</div><h1 className='mt-2 text-2xl font-bold'>Page not found</h1><p className='mt-2 text-sm text-muted-foreground'>The requested admin route does not exist.</p><Button asChild className='mt-5'><Link href='/overview'>Back to overview</Link></Button></div></main>}
