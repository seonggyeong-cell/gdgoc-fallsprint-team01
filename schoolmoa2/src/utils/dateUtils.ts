/**
 * Date and D-Day utility functions
 * Fixed reference date: 2026-11-01 (aligned with GDGoC Inha benchmark & test cases)
 */

export const REFERENCE_DATE_STR = '2026-11-01';

export interface DDayResult {
  dDayText: string;
  diffDays: number;
  status: 'urgent' | 'caution' | 'normal' | 'closed' | 'ongoing';
  mmDd: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  badgeClass: string;
}

export function calculateDDay(targetDateStr: string, isOngoing?: boolean): DDayResult {
  if (isOngoing || !targetDateStr) {
    return {
      dDayText: '상시',
      diffDays: 999,
      status: 'ongoing',
      mmDd: '상시모집',
      textColor: '#475569',
      bgColor: '#F1F5F9',
      borderColor: '#E2E8F0',
      badgeClass: 'text-[#475569] bg-[#F1F5F9] border-[#E2E8F0]',
    };
  }

  // Parse reference date: 2026-11-01
  const [refY, refM, refD] = REFERENCE_DATE_STR.split('-').map(Number);
  const now = new Date(refY, refM - 1, refD);

  const [year, month, day] = targetDateStr.split('-').map(Number);
  const target = new Date(year, month - 1, day);

  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const mmDd = `${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;

  if (diffDays < 0) {
    return {
      dDayText: '마감',
      diffDays,
      status: 'closed',
      mmDd,
      textColor: '#94A3B8',
      bgColor: '#F8FAFC',
      borderColor: '#E2E8F0',
      badgeClass: 'text-neutral-400 bg-neutral-100 border-neutral-200',
    };
  }

  if (diffDays === 0) {
    return {
      dDayText: 'D-Day',
      diffDays: 0,
      status: 'urgent',
      mmDd,
      textColor: '#E11D48',
      bgColor: '#FFF1F3',
      borderColor: '#FFE4E6',
      badgeClass: 'text-[#E11D48] bg-[#FFF1F3] border-[#FFE4E6] font-bold',
    };
  }

  if (diffDays <= 7) {
    return {
      dDayText: `D-${diffDays}`,
      diffDays,
      status: 'urgent',
      mmDd,
      textColor: '#E11D48',
      bgColor: '#FFF1F3',
      borderColor: '#FFE4E6',
      badgeClass: 'text-[#E11D48] bg-[#FFF1F3] border-[#FFE4E6] font-bold',
    };
  }

  if (diffDays <= 14) {
    return {
      dDayText: `D-${diffDays}`,
      diffDays,
      status: 'caution',
      mmDd,
      textColor: '#C2410C',
      bgColor: '#FFF7E6',
      borderColor: '#FFEDD5',
      badgeClass: 'text-[#C2410C] bg-[#FFF7E6] border-[#FFEDD5] font-semibold',
    };
  }

  return {
    dDayText: `D-${diffDays}`,
    diffDays,
    status: 'normal',
    mmDd,
    textColor: '#0B2A5B',
    bgColor: '#EEF4FF',
    borderColor: '#DBEAFE',
    badgeClass: 'text-[#0B2A5B] bg-[#EEF4FF] border-[#DBEAFE] font-semibold',
  };
}

export function formatDateKorean(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[0]}년 ${parseInt(parts[1], 10)}월 ${parseInt(parts[2], 10)}일`;
  }
  return dateStr;
}

export function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parseInt(parts[1], 10)}.${parseInt(parts[2], 10)}`;
  }
  return dateStr;
}

export function generateIcsCalendar(title: string, description: string, deadlineStr: string): void {
  const cleanDate = (deadlineStr || REFERENCE_DATE_STR).replace(/-/g, '');
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//스쿨모아//SchoolHub-INHA//KO',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `SUMMARY:[스쿨모아 마감] ${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `DTSTART;VALUE=DATE:${cleanDate}`,
    `DTEND;VALUE=DATE:${cleanDate}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${title.replace(/\s+/g, '_')}_마감일정.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateAllBookmarksIcs(items: { title: string; deadline: string; benefit: string }[]): void {
  if (items.length === 0) return;
  const events = items
    .filter((i) => i.deadline)
    .map((item) => {
      const cleanDate = item.deadline.replace(/-/g, '');
      return [
        'BEGIN:VEVENT',
        `SUMMARY:[스쿨모아] ${item.title}`,
        `DESCRIPTION:혜택: ${item.benefit || ''}\\n마감일: ${item.deadline}`,
        `DTSTART;VALUE=DATE:${cleanDate}`,
        `DTEND;VALUE=DATE:${cleanDate}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
      ].join('\r\n');
    })
    .join('\r\n');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//스쿨모아//SchoolHub-INHA//KO',
    'CALSCALE:GREGORIAN',
    events,
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `스쿨모아_내보관함_전체일정.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
