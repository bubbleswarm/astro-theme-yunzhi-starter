import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';

dayjs.extend(relativeTime);

export function formatDate(date: Date | number): string {
  return dayjs(date).format('YYYY-MM-DD');
}

export function formatDateTime(date: Date | number): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm');
}

export function formatDateTimeSeconds(date: Date | number): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

export function formatRelativeDate(date: Date | number): string {
  return dayjs(date).fromNow();
}

export function formatLocalDateTimeSeconds(timestamp: number): string {
  const d = new Date(timestamp);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
