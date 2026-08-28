'use client';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Gamepad2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { CreateModeDialog } from '@/components/games/create-mode-dialog';
import { GameModeTable } from '@/components/games/game-mode-table';
import { listAdminGameModes, listAdminGames } from '@/features/games/admin-games-api';
export default function GamesPage(){const games=useQuery({queryKey:['admin','games'],queryFn:listAdminGames}); const [selected,setSelected]=useState('LUDO'); const active=useMemo(()=>games.data?.find(g=>g.code===selected)??games.data?.[0],[games.data,selected]); const modes=useQuery({queryKey:['admin','game-modes',active?.code],queryFn:()=>listAdminGameModes(active!.code),enabled:!!active}); if(games.isLoading)return <Skeleton className='h-[560px]'/>; if(games.isError||!games.data)return <ErrorState message='Could not load games. Ensure the A8 admin game-list support endpoints are installed.' onRetry={()=>void games.refetch()}/>; return <><PageHeader eyebrow='Games' title='Games & Ludo modes' description='Manage commercial/runtime mode settings without exposing core Ludo rules as arbitrary admin configuration.' actions={active?.code==='LUDO'?<CreateModeDialog gameCode={active.code}/>:undefined}/><div className='mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>{games.data.map(g=><button key={g.id} onClick={()=>setSelected(g.code)} className={`text-left ${selected===g.code?'ring-2 ring-primary ring-offset-2 ring-offset-background rounded-xl':''}`}><Card><CardContent className='flex items-center gap-4 p-5'><div className='grid h-11 w-11 place-items-center rounded-xl bg-muted'><Gamepad2 className='h-5 w-5'/></div><div className='min-w-0 flex-1'><div className='flex items-center gap-2'><h2 className='font-semibold'>{g.name}</h2><Badge variant={g.enabled?'success':'neutral'}>{g.enabled?'ACTIVE':'DISABLED'}</Badge></div><p className='mt-1 text-xs text-muted-foreground'>{g._count.modes} modes · {g._count.matches} matches</p></div></CardContent></Card></button>)}</div>{!active?null:modes.isLoading?<Skeleton className='h-96'/>:modes.isError||!modes.data?<ErrorState message='Could not load game modes.' onRetry={()=>void modes.refetch()}/>:<GameModeTable gameCode={active.code} modes={modes.data}/>}</>}
