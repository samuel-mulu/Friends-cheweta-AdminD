import { formatDistanceToNow, format } from 'date-fns';
export const formatDate = (value: string | Date) => format(new Date(value), 'MMM d, yyyy');
export const formatDateTime = (value: string | Date) => format(new Date(value), 'MMM d, yyyy · HH:mm');
export const timeAgo = (value: string | Date) => formatDistanceToNow(new Date(value), { addSuffix: true });
