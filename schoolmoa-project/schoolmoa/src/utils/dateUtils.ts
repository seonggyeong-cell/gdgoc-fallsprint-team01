// [담당: 역할 D] 날짜·D-Day·ICS 유틸. '오늘'은 항상 getToday()로만 가져옵니다.
import { CLOSING_SOON_DAYS, getToday } from '@/config/constants';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const parseISODate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export function daysFromToday(n: number): string {
  const d = getToday();
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

export function calculateDDay(targetDateStr: string, isOngoing?: boolean) {
  if (isOngoing) {
    return { dDayText: '상시모집', diffDays: 999, status: 'ongoing' as const, badgeColorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  }
  const diffDays = Math.round((parseISODate(targetDateStr).getTime() - getToday().getTime()) / 86400000);

  if (diffDays < 0) return { dDayText: '마감됨', diffDays, status: 'closed' as const, badgeColorClass: 'text-neutral-500 bg-neutral-100 border-neutral-200' };
  if (diffDays === 0) return { dDayText: 'D-Day 오늘 마감', diffDays, status: 'closing-soon' as const, badgeColorClass: 'text-rose-700 bg-rose-50 border-rose-200 font-semibold' };
  if (diffDays <= CLOSING_SOON_DAYS) return { dDayText: `D-${diffDays} (마감임박)`, diffDays, status: 'closing-soon' as const, badgeColorClass: 'text-amber-800 bg-amber-50 border-amber-200 font-semibold' };
  return { dDayText: `D-${diffDays}`, diffDays, status: 'recruiting' as const, badgeColorClass: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
}

export function formatDateKorean(dateStr: string): string {
  const p = dateStr?.split('-');
  return p?.length === 3 ? `${p[0]}년 ${parseInt(p[1], 10)}월 ${parseInt(p[2], 10)}일` : dateStr ?? '';
}

export function formatShortDate(dateStr: string): string {
  const p = dateStr?.split('-');
  return p?.length === 3 ? `${parseInt(p[1], 10)}.${parseInt(p[2], 10)}` : dateStr ?? '';
}

/** 마감일 표기: 2026.11.05 (목) */
export function formatDeadlineLabel(dateStr: string): string {
  if (!dateStr) return '';
  const d = parseISODate(dateStr);
  return `${dateStr.replace(/-/g, '.')} (${WEEKDAYS[d.getDay()]})`;
}

const icsEscape = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const icsDate = (d: Date) => toISODate(d).replace(/-/g, '');

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

/** 마감일을 종일 일정(.ics)으로 내려받기 */
export function generateIcsCalendar(title: string, description: string, deadlineStr: string, url?: string): void {
  const start = parseISODate(deadlineStr);
  const end = new Date(start);
  end.setDate(end.getDate() + 1); // 종일 일정의 DTEND는 다음날(미포함)
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//스쿨모아//Schoolmoa//KO', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${icsDate(start)}-${Math.abs(hash(title))}@schoolmoa`,
    `DTSTAMP:${stamp}`,
    `SUMMARY:${icsEscape(`[스쿨모아 마감] ${title}`)}`,
    `DESCRIPTION:${icsEscape(description)}`,
    ...(url ? [`URL:${url}`] : []),
    `DTSTART;VALUE=DATE:${icsDate(start)}`,
    `DTEND;VALUE=DATE:${icsDate(end)}`,
    'END:VEVENT', 'END:VCALENDAR',
  ];
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = `${title.replace(/[\\/:*?"<>|\s]+/g, '_')}_마감일정.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(href);
}
