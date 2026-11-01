// [담당: 역할 D] 마감일 캘린더. 표시할 공고 목록(notices)은 App에서 결정해서 내려줍니다(로그인 시 내 보관함 공고).
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Sparkles } from 'lucide-react';
import { getToday } from '@/config/constants';
import type { NoticeItem } from '@/types';
import { calculateDDay, toISODate } from '@/utils/dateUtils';

interface CalendarViewProps {
  notices: NoticeItem[];
  onSelectNotice: (notice: NoticeItem) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ notices, onSelectNotice }) => {
  const today = getToday();
  const todayStr = toISODate(today);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDateStr(todayStr);
  };

  // Build calendar matrix
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Map notices by deadline
  const noticesByDate = React.useMemo(() => {
    const map: Record<string, NoticeItem[]> = {};
    for (const item of notices) {
      if (item.deadline && !item.isOngoing) {
        if (!map[item.deadline]) {
          map[item.deadline] = [];
        }
        map[item.deadline].push(item);
      }
    }
    return map;
  }, [notices]);

  // Selected date notices
  const selectedDateNotices = noticesByDate[selectedDateStr] || [];

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar Grid (2 cols on lg) */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
        {/* Month Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-neutral-900 tabular-nums">
              {currentYear}년 {currentMonth + 1}월
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded border border-neutral-200 transition-colors cursor-pointer"
            >
              오늘
            </button>
            <div className="flex items-center border border-neutral-200 rounded">
              <button
                onClick={handlePrevMonth}
                className="p-1 hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer"
                title="이전 달"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1 hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer"
                title="다음 달"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Day of week headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-neutral-500 mb-1 py-1 border-b border-neutral-100">
          {daysOfWeek.map((day, idx) => (
            <div
              key={day}
              className={idx === 0 ? 'text-rose-500' : idx === 6 ? 'text-blue-500' : ''}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1 auto-rows-fr">
          {/* Empty cells before day 1 */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[85px] p-1 bg-neutral-50/50 rounded" />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayNotices = noticesByDate[dateStr] || [];
            const isSelected = selectedDateStr === dateStr;
            const isToday = dateStr === todayStr;
            const dayOfWeekIdx = (firstDayOfMonth + i) % 7;

            return (
              <div
                key={dateStr}
                onClick={() => setSelectedDateStr(dateStr)}
                className={`min-h-[85px] p-1.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-500'
                    : isToday
                      ? 'border-amber-300 bg-amber-50/20'
                      : 'border-neutral-100 hover:border-neutral-300 hover:bg-neutral-50/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold tabular-nums ${
                      isToday
                        ? 'w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[11px]'
                        : dayOfWeekIdx === 0
                          ? 'text-rose-600'
                          : dayOfWeekIdx === 6
                            ? 'text-blue-600'
                            : 'text-neutral-700'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayNotices.length > 0 && (
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1 rounded tabular-nums">
                      {dayNotices.length}건 마감
                    </span>
                  )}
                </div>

                {/* Deadlines Mini list in cell */}
                <div className="mt-1 space-y-1">
                  {dayNotices.slice(0, 2).map((notice) => (
                    <div
                      key={notice.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectNotice(notice);
                      }}
                      className="text-[10px] leading-tight font-medium text-neutral-800 hover:text-indigo-600 truncate p-0.5 rounded bg-white border border-neutral-200/80 shadow-xs"
                      title={notice.title}
                    >
                      {notice.title}
                    </div>
                  ))}
                  {dayNotices.length > 2 && (
                    <div className="text-[9px] text-neutral-400 font-medium text-right">
                      +{dayNotices.length - 2}건 더보기
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda (1 col on lg) */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
          <div>
            <div className="text-xs text-neutral-400 font-medium">선택한 날짜 일정</div>
            <h4 className="text-base font-bold text-neutral-900 tabular-nums">
              {selectedDateStr}
            </h4>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 tabular-nums">
            총 {selectedDateNotices.length}건
          </span>
        </div>

        {selectedDateNotices.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-neutral-400">
            <Clock className="w-10 h-10 stroke-1 text-neutral-300 mb-2" />
            <p className="text-sm font-medium text-neutral-600">
              이 날 마감되는 공고가 없습니다.
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              달력에서 마감 표시가 있는 날짜를 클릭해보세요.
            </p>
          </div>
        ) : (
          <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
            {selectedDateNotices.map((notice) => {
              const dDay = calculateDDay(notice.deadline, notice.isOngoing);
              return (
                <div
                  key={notice.id}
                  onClick={() => onSelectNotice(notice)}
                  className="p-3 rounded-lg border border-neutral-200 hover:border-indigo-300 hover:bg-neutral-50/80 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-semibold text-neutral-500">
                      {notice.subcategory} · {notice.organizer}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded border tabular-nums ${dDay.badgeColorClass}`}>
                      {dDay.dDayText}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-neutral-900 line-clamp-2 hover:text-indigo-600 transition-colors">
                    {notice.title}
                  </h5>
                  <div className="mt-2 text-[11px] text-neutral-600 flex items-center gap-1 font-medium">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{notice.benefit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
