'use client';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export function DialogContent({ children }: { children: React.ReactNode }) { return <DialogPrimitive.Portal><DialogPrimitive.Overlay className='fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]'/><DialogPrimitive.Content className='fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-card p-6 shadow-xl'><DialogPrimitive.Close className='absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-muted'><X className='h-4 w-4'/></DialogPrimitive.Close>{children}</DialogPrimitive.Content></DialogPrimitive.Portal>; }
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
