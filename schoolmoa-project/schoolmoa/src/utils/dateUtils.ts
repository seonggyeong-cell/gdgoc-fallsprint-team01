// [담당: 역할 D] 날짜·D-Day·ICS 유틸. '오늘'은 항상 getToday()로만 가져옵니다.
import { CLOSING_SOON_DAYS, getToday } from '@/config/constants';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const parseISODate = (s?: string | null): Date => {
  if (!s || typeof s !== 'string') return getToday();
  const parts = s.split('-');
  if (parts.length < 3) return getToday();
  const [y, m, d] = parts.map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return getToday();
  return new Date(y, m - 1, d);
};

export function daysFromToday(n: number): string {
  const d = getToday();
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

export function calculateDDay(targetDateStr?: string | null, isOngoing?: boolean) {
  if (isOngoing || !targetDateStr) {
    return {
      dDayText: isOngoing ? '상시모집' : '상시모집',
      diffDays: 999,
      status: 'ongoing' as const,
      badgeColorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    };
  }

  const targetDate = parseISODate(targetDateStr);
  const diffDays = Math.round((targetDate.getTime() - getToday().getTime()) / 86400000);

  if (diffDays < 0) {
    return { dDayText: '마감됨', diffDays, status: 'closed' as const, badgeColorClass: 'text-neutral-500 bg-neutral-100 border-neutral-200' };
  }
  if (diffDays === 0) {
    return { dDayText: 'D-Day 오늘 마감', diffDays, status: 'closing-soon' as const, badgeColorClass: 'text-rose-700 bg-rose-50 border-rose-200 font-semibold' };
  }
  if (diffDays <= CLOSING_SOON_DAYS) {
    return { dDayText: `D-${diffDays} (마감임박)`, diffDays, status: 'closing-soon' as const, badgeColorClass: 'text-amber-800 bg-amber-50 border-amber-200 font-semibold' };
  }
  return { dDayText: `D-${diffDays}`, diffDays, status: 'recruiting' as const, badgeColorClass: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
}

export function formatDateKorean(dateStr?: string | null): string {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const p = dateStr.split('-');
  return p.length === 3 ? `${p[0]}년 ${parseInt(p[1], 10)}월 ${parseInt(p[2], 10)}일` : dateStr;
}

export function formatShortDate(dateStr?: string | null): string {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const p = dateStr.split('-');
  return p.length === 3 ? `${parseInt(p[1], 10)}.${parseInt(p[2], 10)}` : dateStr;
}

/** 마감일 표기: 2026.11.05 (목) */
export function formatDeadlineLabel(dateStr?: string | null): string {
  if (!dateStr || typeof dateStr !== 'string') return '마감일 미정';
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
export function generateIcsCalendar(title: string, description: string, deadlineStr?: string | null, url?: string): void {
  if (!deadlineStr) return;
  const start = parseISODate(deadlineStr);
  const end = new Date(start);
  end.setDate(end.getDate() + 1); // ICS의 all-day 이벤트는 DTEND가 다음 날이어야 당일 하루로 인식됨

  const now = new Date();
  const uid = `${toISODate(now)}-${Math.abs(hash(title + deadlineStr))}@schoolmoa.local`;

  const descWithUrl = [description, url ? `공고 링크: ${url}` : ''].filter(Boolean).join('\n\n');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//스쿨모아//SchoolMoa//KO',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${icsDate(now)}T000000Z`,
    `DTSTART;VALUE=DATE:${icsDate(start)}`,
    `DTEND;VALUE=DATE:${icsDate(end)}`,
    `SUMMARY:[스쿨모아 마감] ${icsEscape(title)}`,
    `DESCRIPTION:${icsEscape(descWithUrl)}`,
    url ? `URL:${url}` : '',
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:[마감 D-1] ${icsEscape(title)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `[마감]_${title.replace(/[\/\\?%*:|"<>]/g, '_').slice(0, 30)}_${deadlineStr}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
