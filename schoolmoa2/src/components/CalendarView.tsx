import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Download,
  Info,
  CheckCircle2,
  Check,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  Filter,
} from 'lucide-react';
import { NoticeItem, NoticeCategory, ApplicationStage, BookmarkRecord } from '../types/notice';
import { calculateDDay, generateAllBookmarksIcs } from '../utils/dateUtils';
import { CATEGORIES, CATEGORY_LIST } from '../constants/categories';

interface CalendarViewProps {
  notices: NoticeItem[];
  bookmarkedItems?: NoticeItem[];
  records?: Record<string, BookmarkRecord>;
  onUpdateRecord?: (id: string, stage: ApplicationStage, memo?: string) => void;
  onToggleBookmark?: (id: string) => void;
  onSelectNotice: (notice: NoticeItem) => void;
  onShowToast: (msg: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  notices,
  bookmarkedItems = [],
  records = {},
  onUpdateRecord,
  onToggleBookmark,
  onSelectNotice,
  onShowToast,
}) => {
  // Current calendar month: November 2026 (matching reference benchmark date 2026-11-01)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // 0-indexed: 10 = November
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  // Category filters: empty array = all categories active
  const [selectedCategories, setSelectedCategories] = useState<NoticeCategory[]>([]);

  // Hide submitted/completed applications toggle (saved in localStorage for seamless experience)
  const [hideSubmitted, setHideSubmitted] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('schoolmoa_calendar_hide_submitted');
      return stored !== null ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  const handleToggleHideSubmitted = () => {
    const nextVal = !hideSubmitted;
    setHideSubmitted(nextVal);
    try {
      localStorage.setItem('schoolmoa_calendar_hide_submitted', JSON.stringify(nextVal));
    } catch {}
    if (nextVal) {
      onShowToast('지원 완료된 공고를 캘린더에서 숨겼습니다.');
    } else {
      onShowToast('지원 완료된 공고를 캘린더에 다시 표시합니다.');
    }
  };

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
    setCurrentYear(2026);
    setCurrentMonth(10); // November
    setSelectedDateStr(null);
  };

  // Helper: check if a notice is submitted or accepted
  const isNoticeSubmitted = (id: string): boolean => {
    const stage = records[id]?.stage;
    return stage === 'submitted' || stage === 'accepted';
  };

  // Count total submitted notices among all notices
  const totalSubmittedCount = useMemo(() => {
    return notices.filter((n) => isNoticeSubmitted(n.id)).length;
  }, [notices, records]);

  // Category Toggle Handler
  const handleToggleCategory = (catKey: NoticeCategory) => {
    if (selectedCategories.length === 0) {
      // First click: focus on this single category
      setSelectedCategories([catKey]);
    } else if (selectedCategories.includes(catKey)) {
      // Already selected: remove it
      const next = selectedCategories.filter((k) => k !== catKey);
      setSelectedCategories(next);
    } else {
      // Add category
      const next = [...selectedCategories, catKey];
      if (next.length === CATEGORY_LIST.length) {
        setSelectedCategories([]); // all selected -> reset to all
      } else {
        setSelectedCategories(next);
      }
    }
  };

  const handleSelectAllCategories = () => {
    setSelectedCategories([]);
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setHideSubmitted(false);
    try {
      localStorage.setItem('schoolmoa_calendar_hide_submitted', JSON.stringify(false));
    } catch {}
    onShowToast('카테고리 및 숨김 필터가 초기화되었습니다.');
  };

  // Filter notices based on category selection and hideSubmitted
  const filteredNotices = useMemo(() => {
    return notices.filter((item) => {
      // 1. Hide submitted filter
      if (hideSubmitted && isNoticeSubmitted(item.id)) {
        return false;
      }
      // 2. Category filter (if selectedCategories is not empty, item must be in it)
      if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) {
        return false;
      }
      return true;
    });
  }, [notices, hideSubmitted, records, selectedCategories]);

  // Notice counts by category in this calendar month
  const categoryCountsThisMonth = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    for (const cat of CATEGORY_LIST) {
      counts[cat.key] = 0;
    }

    const monthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

    for (const item of notices) {
      if (item.deadline && item.deadline.startsWith(monthStr)) {
        // If hideSubmitted is active, don't count submitted notices
        if (hideSubmitted && isNoticeSubmitted(item.id)) {
          continue;
        }
        counts.all++;
        if (counts[item.category] !== undefined) {
          counts[item.category]++;
        }
      }
    }
    return counts;
  }, [notices, currentYear, currentMonth, hideSubmitted, records]);

  // Map notices by deadline
  const noticesByDate = useMemo(() => {
    const map: Record<string, NoticeItem[]> = {};
    for (const item of filteredNotices) {
      if (item.deadline) {
        if (!map[item.deadline]) {
          map[item.deadline] = [];
        }
        map[item.deadline].push(item);
      }
    }
    return map;
  }, [filteredNotices]);

  // Map of hidden submitted notices by deadline (to show helpful info when date is clicked)
  const hiddenSubmittedByDate = useMemo(() => {
    const map: Record<string, NoticeItem[]> = {};
    for (const item of notices) {
      if (item.deadline && isNoticeSubmitted(item.id)) {
        // Check if matching category as well
        if (selectedCategories.length === 0 || selectedCategories.includes(item.category)) {
          if (!map[item.deadline]) {
            map[item.deadline] = [];
          }
          map[item.deadline].push(item);
        }
      }
    }
    return map;
  }, [notices, records, selectedCategories]);

  // Calendar matrix calculation
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Selected date notices vs upcoming default notices
  const displayedNotices = useMemo(() => {
    if (selectedDateStr) {
      return noticesByDate[selectedDateStr] || [];
    }
    // Default: 다가오는 마감 리스트 (Sorted by earliest deadline)
    return [...filteredNotices]
      .filter((n) => !n.isOngoing)
      .sort((a, b) => a.deadline.localeCompare(b.deadline))
      .slice(0, 8);
  }, [filteredNotices, selectedDateStr, noticesByDate]);

  // Hidden submitted notices for the currently selected date
  const hiddenForSelectedDate = useMemo(() => {
    if (!selectedDateStr || !hideSubmitted) return [];
    return hiddenSubmittedByDate[selectedDateStr] || [];
  }, [selectedDateStr, hideSubmitted, hiddenSubmittedByDate]);

  const handleExportIcs = () => {
    const itemsToExport = bookmarkedItems.length > 0 ? bookmarkedItems : filteredNotices.slice(0, 8);
    generateAllBookmarksIcs(
      itemsToExport.map((n) => ({
        title: n.title,
        deadline: n.deadline,
        benefit: n.benefit,
      }))
    );
    onShowToast('캘린더 일정(.ics) 파일이 다운로드되었습니다. 구글 캘린더나 애플 캘린더에 가져오기 해보세요.');
  };

  const handleToggleSubmittedDirect = (notice: NoticeItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdateRecord) return;

    const isSubmitted = isNoticeSubmitted(notice.id);
    const nextStage: ApplicationStage = isSubmitted ? 'preparing' : 'submitted';

    onUpdateRecord(notice.id, nextStage);
    if (!isSubmitted) {
      onShowToast(`'${notice.title}' 공고를 지원 완료로 표시했습니다.`);
    } else {
      onShowToast(`'${notice.title}' 공고를 지원 준비중으로 되돌렸습니다.`);
    }
  };

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  const hasActiveFilters = selectedCategories.length > 0 || hideSubmitted;

  return (
    <div className="space-y-4">
      {/* 1. Top Banner with Action Controls */}
      <div className="bg-white rounded-[16px] border border-[#E3E8F0] p-4.5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#EEF4FF] text-[#1D5FC4] flex items-center justify-center shrink-0">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-extrabold text-[#0F172A]">
                  인하대 기회 및 학사 마감 캘린더
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#0B2A5B] text-white tabular-nums">
                  {filteredNotices.length}건 표시 중
                </span>
              </div>
              <p className="text-[12px] text-neutral-500 mt-0.5">
                원하는 분야만 선택하고, 이미 지원 완료한 공고를 숨겨 일정을 한눈에 파악하세요.
              </p>
            </div>
          </div>

          {/* Action Buttons: Hide Submitted Toggle + .ics Export */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {/* 지원 완료 공고 숨기기 Toggle Button */}
            <button
              type="button"
              onClick={handleToggleHideSubmitted}
              className={`py-2 px-3.5 rounded-[10px] text-[12px] font-extrabold transition-all cursor-pointer flex items-center gap-2 border shadow-xs ${
                hideSubmitted
                  ? 'bg-[#0E9F6E] border-[#0E9F6E] text-white shadow-sm'
                  : 'bg-white border-[#E3E8F0] text-neutral-700 hover:bg-neutral-50'
              }`}
              title="지원 완료(제출 완료 및 합격)된 공고를 달력과 목록에서 숨기거나 표시합니다"
            >
              {hideSubmitted ? (
                <>
                  <EyeOff className="w-4 h-4 shrink-0 text-white" />
                  <span>지원 완료 숨김 적용 중</span>
                  {totalSubmittedCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/25 text-white tabular-nums font-black">
                      {totalSubmittedCount}건 숨김
                    </span>
                  )}
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 shrink-0 text-neutral-400" />
                  <span>지원 완료 공고 숨기기</span>
                  {totalSubmittedCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-100 text-neutral-600 tabular-nums font-bold">
                      {totalSubmittedCount}건 완료
                    </span>
                  )}
                </>
              )}
            </button>

            {/* .ics 내보내기 */}
            <button
              onClick={handleExportIcs}
              className="py-2 px-3.5 rounded-[10px] bg-[#0B2A5B] hover:bg-[#1D5FC4] text-white font-bold text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.ics 캘린더 내보내기</span>
            </button>
          </div>
        </div>

        {/* 2. Category Filter Strip (카테고리별 분야 선택 칩스) */}
        <div className="pt-3.5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-extrabold text-[#0B2A5B] flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#1D5FC4]" />
                <span>분야별 필터:</span>
              </span>
              <span className="text-[11px] text-neutral-400">
                원하는 카테고리를 클릭하여 해당 분야의 일정만 달력에 표시할 수 있습니다. (다중 선택 가능)
              </span>
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-neutral-400 hover:text-neutral-700 flex items-center gap-1 underline cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>필터 초기화</span>
              </button>
            )}
          </div>

          {/* Chips list */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {/* '전체 분야' Button */}
            <button
              type="button"
              onClick={handleSelectAllCategories}
              className={`px-3 py-1.5 rounded-full text-[12px] font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shadow-xs border ${
                selectedCategories.length === 0
                  ? 'bg-[#0B2A5B] border-[#0B2A5B] text-white'
                  : 'bg-white border-[#E3E8F0] text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <span>전체 분야</span>
              <span
                className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums ${
                  selectedCategories.length === 0 ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {categoryCountsThisMonth.all}
              </span>
            </button>

            {/* 7 Category Buttons */}
            {CATEGORY_LIST.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategories.includes(cat.key);
              const count = categoryCountsThisMonth[cat.key] || 0;

              return (
                <button
                  type="button"
                  key={cat.key}
                  onClick={() => handleToggleCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border shadow-xs ${
                    isSelected
                      ? 'shadow-sm text-white'
                      : 'bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                  style={{
                    backgroundColor: isSelected ? cat.color : '#ffffff',
                    borderColor: isSelected ? cat.color : `${cat.color}40`,
                    color: isSelected ? '#ffffff' : cat.color,
                  }}
                  title={`${cat.label} 공고만 캘린더에 표시`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: isSelected ? '#ffffff' : cat.color }}
                  />
                  <span>{cat.label}</span>
                  <span
                    className={`text-[11px] font-extrabold px-1.5 py-0.2 rounded-full tabular-nums ${
                      isSelected ? 'bg-white/25 text-white' : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Filter Status Pill Strip */}
          {hasActiveFilters && (
            <div className="mt-2.5 pt-2.5 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-neutral-400 font-semibold">적용 중:</span>
                {selectedCategories.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[6px] bg-[#EEF4FF] text-[#0B2A5B] font-bold border border-[#1D5FC4]/20">
                    <span>
                      분야: {selectedCategories.map((k) => CATEGORIES[k]?.label).join(', ')}
                    </span>
                    <button
                      onClick={handleSelectAllCategories}
                      className="hover:text-rose-500 font-bold ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                )}
                {hideSubmitted && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[6px] bg-[#EAF8F1] text-[#0E9F6E] font-bold border border-[#0E9F6E]/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>지원 완료 공고 숨김 적용</span>
                    <button
                      onClick={handleToggleHideSubmitted}
                      className="hover:text-rose-500 font-bold ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
              <div className="text-neutral-400 font-medium">
                조건에 맞는 공고 <strong className="text-[#0B2A5B] tabular-nums">{filteredNotices.length}</strong>건 표시
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Main Calendar Layout: Grid + Agenda */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Calendar Grid (2 cols on lg) */}
        <div className="lg:col-span-2 bg-white rounded-[16px] border border-[#E3E8F0] p-5 shadow-xs">
          {/* Month Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-[18px] font-extrabold text-[#0F172A] tabular-nums">
                {currentYear}년 {currentMonth + 1}월
              </h3>
              {hideSubmitted && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#0E9F6E] bg-[#EAF8F1] px-2 py-0.5 rounded-full border border-[#0E9F6E]/30">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>지원 완료 제외됨</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToday}
                className="px-2.5 py-1 text-[12px] font-semibold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-[8px] transition-colors cursor-pointer"
              >
                11월 오늘
              </button>
              <div className="flex items-center border border-[#E3E8F0] rounded-[8px] overflow-hidden bg-white shadow-2xs">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer"
                  title="이전 달"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer"
                  title="다음 달"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[12px] font-bold text-neutral-400 mb-1 py-1 border-b border-neutral-100">
            {daysOfWeek.map((day, idx) => (
              <div
                key={day}
                className={idx === 0 ? 'text-rose-500' : idx === 6 ? 'text-blue-500' : ''}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1 auto-rows-fr">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[86px] p-1 bg-neutral-50/50 rounded-[8px]" />
            ))}

            {/* Month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayNotices = noticesByDate[dateStr] || [];
              const hiddenSubmittedNotices = hiddenSubmittedByDate[dateStr] || [];
              const isSelected = selectedDateStr === dateStr;
              const isToday = dateStr === '2026-11-01'; // benchmark today
              const dayOfWeekIdx = (firstDayOfMonth + i) % 7;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDateStr(isSelected ? null : dateStr)}
                  className={`min-h-[86px] p-1.5 rounded-[10px] border transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'border-[#1D5FC4] bg-[#EEF4FF]/60 ring-2 ring-[#1D5FC4] shadow-xs'
                      : isToday
                        ? 'border-amber-400 bg-amber-50/30 font-bold'
                        : 'border-[#E3E8F0]/80 hover:border-neutral-300 hover:bg-neutral-50/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[12px] font-bold tabular-nums ${
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

                    {/* Badge: Visible notice count for day */}
                    {dayNotices.length > 0 ? (
                      <span className="text-[10px] font-extrabold text-[#E11D48] bg-[#FFF1F3] px-1.5 py-0.2 rounded-full tabular-nums border border-[#FFE4E6]">
                        {dayNotices.length}건
                      </span>
                    ) : hideSubmitted && hiddenSubmittedNotices.length > 0 ? (
                      /* If only submitted notices were on this day and hidden */
                      <span
                        className="text-[9px] font-bold text-[#0E9F6E] bg-[#EAF8F1] px-1 py-0.2 rounded-full tabular-nums"
                        title={`지원 완료 공고 ${hiddenSubmittedNotices.length}건 숨김됨`}
                      >
                        ✓ 완료
                      </span>
                    ) : null}
                  </div>

                  {/* Category Color Dots & Mini Bar */}
                  <div className="mt-1 space-y-1">
                    <div className="flex flex-wrap gap-1">
                      {dayNotices.slice(0, 4).map((n) => {
                        const cat = CATEGORIES[n.category] || CATEGORIES.academic;
                        const isSubmitted = isNoticeSubmitted(n.id);
                        return (
                          <span
                            key={n.id}
                            className={`w-2.5 h-2.5 rounded-full shrink-0 transition-transform group-hover:scale-110 ${
                              isSubmitted ? 'ring-1 ring-emerald-500 ring-offset-1' : ''
                            }`}
                            style={{ backgroundColor: cat.color }}
                            title={`${cat.label}${isSubmitted ? ' (지원완료)' : ''}: ${n.title}`}
                          />
                        );
                      })}
                    </div>

                    {/* Top 1 truncated title preview on hover/select */}
                    {dayNotices.length > 0 ? (
                      <div className="text-[10px] font-medium text-neutral-700 truncate leading-tight group-hover:text-[#1D5FC4]">
                        {dayNotices[0].title}
                      </div>
                    ) : hideSubmitted && hiddenSubmittedNotices.length > 0 ? (
                      <div className="text-[10px] text-neutral-400 italic truncate leading-tight">
                        (지원 완료 숨김)
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Agenda Panel: Defaults to "다가오는 마감 리스트" */}
        <div className="bg-white rounded-[16px] border border-[#E3E8F0] p-5 shadow-xs flex flex-col">
          {/* Header */}
          <div className="pb-3 border-b border-neutral-100 mb-3.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] text-neutral-400 font-bold">
                  {selectedDateStr ? '선택한 날짜 마감 공고' : '다가오는 마감 리스트'}
                </div>
                <h4 className="text-[16px] font-extrabold text-[#0F172A] tabular-nums mt-0.5">
                  {selectedDateStr || '마감 임박 순서'}
                </h4>
              </div>

              {selectedDateStr && (
                <button
                  onClick={() => setSelectedDateStr(null)}
                  className="text-[11px] font-semibold text-[#1D5FC4] hover:underline cursor-pointer"
                >
                  전체보기로 복귀
                </button>
              )}
            </div>

            {/* Active Agenda Filter Note */}
            <div className="mt-2 text-[11px] text-neutral-500 flex flex-wrap items-center gap-1">
              {selectedCategories.length > 0 && (
                <span className="font-bold text-[#0B2A5B]">
                  [{selectedCategories.map((c) => CATEGORIES[c]?.shortLabel).join(', ')}]
                </span>
              )}
              {hideSubmitted && (
                <span className="text-[#0E9F6E] font-semibold">· 지원 완료 제외</span>
              )}
              <span>· 총 {displayedNotices.length}건 마감 예정</span>
            </div>
          </div>

          {/* Hidden Submitted Notice Callout on selected date */}
          {hiddenForSelectedDate.length > 0 && (
            <div className="mb-3 p-2.5 rounded-[10px] bg-[#EAF8F1] border border-[#0E9F6E]/30 text-[11px] text-[#0E9F6E] flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 truncate">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  이 날짜에 <strong>지원 완료된 공고 {hiddenForSelectedDate.length}건</strong>이 숨겨져 있습니다.
                </span>
              </div>
              <button
                type="button"
                onClick={handleToggleHideSubmitted}
                className="font-extrabold underline hover:text-[#065F46] shrink-0 cursor-pointer"
              >
                숨김 해제
              </button>
            </div>
          )}

          {/* Agenda Notices List */}
          {displayedNotices.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-neutral-400">
              <Clock className="w-10 h-10 stroke-1 text-neutral-300 mb-2" />
              <p className="text-[13px] font-bold text-neutral-600">
                표시할 마감 공고가 없습니다.
              </p>
              <p className="text-[11px] text-neutral-400 mt-1 max-w-xs leading-relaxed">
                {hasActiveFilters
                  ? '카테고리 분야 필터를 변경하거나 지원 완료 숨김을 해제해보세요.'
                  : '달력의 색상 점이 표시된 날짜를 클릭하면 해당 날짜의 마감 일정을 확인할 수 있습니다.'}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-3 px-3 py-1.5 rounded-[8px] bg-[#0B2A5B] hover:bg-[#1D5FC4] text-white text-[11px] font-bold transition-colors cursor-pointer"
                >
                  필터 초기화
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[520px] pr-1">
              {displayedNotices.map((notice) => {
                const cat = CATEGORIES[notice.category] || CATEGORIES.academic;
                const d = calculateDDay(notice.deadline, notice.isOngoing);
                const isSubmitted = isNoticeSubmitted(notice.id);
                const stage = records[notice.id]?.stage;

                return (
                  <div
                    key={notice.id}
                    onClick={() => onSelectNotice(notice)}
                    className={`p-3 rounded-[12px] border transition-all cursor-pointer group flex flex-col justify-between ${
                      isSubmitted
                        ? 'border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50/60'
                        : 'border-[#E3E8F0] hover:border-[#1D5FC4]/50 hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div>
                      {/* Badge row */}
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.2 rounded"
                            style={{
                              backgroundColor: cat.bgColorClass.replace('bg-[', '').replace(']', ''),
                              color: cat.color,
                            }}
                          >
                            {cat.label}
                          </span>

                          {/* Submitted / Application Status Badge */}
                          {stage === 'submitted' && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-[#0E9F6E] bg-[#EAF8F1] px-1.5 py-0.2 rounded-full border border-[#0E9F6E]/30">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>지원 완료</span>
                            </span>
                          )}
                          {stage === 'accepted' && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-[#7C3AED] bg-[#F5F3FF] px-1.5 py-0.2 rounded-full border border-[#7C3AED]/30">
                              <Sparkles className="w-3 h-3" />
                              <span>최종 합격</span>
                            </span>
                          )}
                          {stage === 'preparing' && (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded-full border border-amber-200">
                              준비 중
                            </span>
                          )}
                        </div>

                        {/* D-Day badge */}
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.2 rounded tabular-nums"
                          style={{ backgroundColor: d.bgColor, color: d.textColor }}
                        >
                          {d.dDayText} ({notice.deadline})
                        </span>
                      </div>

                      {/* Title */}
                      <h5
                        className={`text-[13px] font-bold leading-snug line-clamp-2 transition-colors ${
                          isSubmitted ? 'text-neutral-700' : 'text-[#0F172A] group-hover:text-[#1D5FC4]'
                        }`}
                      >
                        {notice.title}
                      </h5>

                      {/* Benefit */}
                      <div className="text-[12px] font-bold text-[#1D5FC4] mt-1.5 truncate">
                        {notice.benefit}
                      </div>
                    </div>

                    {/* Bottom Action Row: Quick Toggle Application Status */}
                    {onUpdateRecord && (
                      <div
                        className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-[10px] text-neutral-400">
                          {notice.organizer}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => handleToggleSubmittedDirect(notice, e)}
                          className={`px-2 py-1 rounded-[6px] text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            isSubmitted
                              ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
                              : 'bg-[#EAF8F1] hover:bg-[#0E9F6E] hover:text-white text-[#0E9F6E] border border-[#0E9F6E]/30'
                          }`}
                          title={isSubmitted ? '지원 상태를 준비 중으로 변경' : '이 공고를 지원 완료로 표시'}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{isSubmitted ? '지원 취소 (준비중)' : '지원 완료로 표시'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
