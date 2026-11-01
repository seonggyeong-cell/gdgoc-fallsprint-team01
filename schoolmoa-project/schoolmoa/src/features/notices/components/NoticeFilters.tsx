// [담당: 역할 A] 카테고리·검색·정렬·상태 필터 바
import React from 'react';
import { Calendar, GraduationCap, LayoutGrid, List, Megaphone, Search, SlidersHorizontal, Sparkles, Trophy, Briefcase, Building2, HeartHandshake, X } from 'lucide-react';
import { CATEGORIES, SOURCES, SORT_OPTIONS, STATUS_OPTIONS } from '@/config/constants';
import type { FilterState, NoticeCategory, NoticeSource, SortKey, ViewMode } from '@/types';

interface Props {
  filters: FilterState;
  onChangeFilters: (next: FilterState) => void;
  onReset: () => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  categoryCounts: Record<string, number>;
  availableSubcategories: string[];
  totalResultsCount: number;
  isLoggedIn: boolean;
  onRequireLogin: () => void;
}

const CATEGORY_ICONS: Record<NoticeCategory | 'all', React.ComponentType<{ className?: string }>> = {
  all: SlidersHorizontal, work: Briefcase, career: Building2, scholarship: GraduationCap,
  competition: Trophy, activity: HeartHandshake, support: Sparkles, academic: Megaphone,
};

const VIEW_BUTTONS: { mode: ViewMode; icon: React.ComponentType<{ className?: string }>; title: string }[] = [
  { mode: 'grid', icon: LayoutGrid, title: '카드 그리드 뷰' },
  { mode: 'table', icon: List, title: '목록 테이블 뷰' },
  { mode: 'calendar', icon: Calendar, title: '마감일 캘린더 뷰' },
];

export const NoticeFilters: React.FC<Props> = ({
  filters, onChangeFilters, onReset, viewMode, onChangeViewMode, categoryCounts,
  availableSubcategories, totalResultsCount, isLoggedIn, onRequireLogin,
}) => {
  const set = (patch: Partial<FilterState>) => onChangeFilters({ ...filters, ...patch });

  const hasActiveFilters =
    filters.category !== 'all' || filters.subcategory !== 'all' || filters.source !== 'all' || filters.status !== 'all' ||
    filters.searchQuery.trim() !== '' || filters.onlyRecommended || filters.includeClosed;

  const categories = [{ key: 'all' as const, label: '전체' }, ...CATEGORIES];
  const segBtn = (on: boolean) =>
    `px-2 py-0.5 text-[11px] rounded transition-colors cursor-pointer ${on ? 'bg-neutral-900 text-white font-medium' : 'text-neutral-600 hover:text-neutral-900'}`;

  return (
    <div className="space-y-4">
      {/* 카테고리 */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.key];
          const selected = filters.category === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => set({ category: cat.key, subcategory: 'all' })}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                selected ? 'bg-neutral-900 text-white shadow-xs' : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/80 hover:bg-neutral-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{cat.label}</span>
              <span className={`tabular-nums text-[11px] px-1.5 rounded-full ${selected ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-100 text-neutral-500'}`}>
                {categoryCounts[cat.key] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* 세부분야 */}
      {filters.category !== 'all' && availableSubcategories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
          <span className="text-neutral-400 shrink-0 text-[11px] font-medium mr-1">세부분야:</span>
          {['all', ...availableSubcategories].map((sub) => (
            <button
              key={sub}
              onClick={() => set({ subcategory: sub })}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer whitespace-nowrap ${
                filters.subcategory === sub ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {sub === 'all' ? '전체 세부' : sub}
            </button>
          ))}
        </div>
      )}

      {/* 검색·정렬·보기 방식 */}
      <div className="p-3 bg-white border border-neutral-200 rounded-xl shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text" value={filters.searchQuery} onChange={(e) => set({ searchQuery: e.target.value })}
              placeholder="제목, 주관기관, 키워드(예: 인턴, 근로장학, 해커톤, 봉사) 검색..."
              className="w-full pl-10 pr-9 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400"
            />
            {filters.searchQuery && (
              <button onClick={() => set({ searchQuery: '' })} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-0.5" title="검색어 지우기">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <span className="hidden sm:inline">출처:</span>
              <select
                value={filters.source} onChange={(e) => set({ source: e.target.value as NoticeSource | 'all' })}
                className="py-1.5 pl-2.5 pr-7 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="all">전체 사이트</option>
                {(Object.keys(SOURCES) as NoticeSource[]).map((s) => <option key={s} value={s}>{SOURCES[s].label}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <span className="hidden sm:inline">정렬:</span>
              <select
                value={filters.sortBy} onChange={(e) => set({ sortBy: e.target.value as SortKey })}
                className="py-1.5 pl-2.5 pr-7 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
              </select>
            </div>
            <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200/80">
              {VIEW_BUTTONS.map(({ mode, icon: Icon, title }) => (
                <button
                  key={mode} onClick={() => onChangeViewMode(mode)} title={title}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === mode ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-800'}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 상태·옵션 */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-neutral-400 text-[11px] font-medium">상태:</span>
              <div className="flex items-center gap-1 bg-neutral-50 p-0.5 rounded-md border border-neutral-200/60">
                {STATUS_OPTIONS.map((s) => (
                  <button key={s.key} onClick={() => set({ status: s.key })} className={segBtn(filters.status === s.key)}>{s.label}</button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] text-neutral-700 hover:text-neutral-900">
              <input
                type="checkbox" checked={filters.includeClosed} onChange={(e) => set({ includeClosed: e.target.checked })}
                className="rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
              />
              <span className="font-medium">마감된 공고 포함</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] text-neutral-700 hover:text-neutral-900">
              <input
                type="checkbox" checked={filters.onlyRecommended}
                onChange={(e) => (isLoggedIn ? set({ onlyRecommended: e.target.checked }) : onRequireLogin())}
                className="rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
              />
              <span className="font-medium">내 맞춤 추천만 보기{!isLoggedIn && ' (로그인 필요)'}</span>
            </label>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>총 <strong className="font-semibold text-neutral-900 tabular-nums">{totalResultsCount}</strong>건의 공고</span>
            {hasActiveFilters && (
              <button onClick={onReset} className="text-[11px] text-rose-600 hover:text-rose-700 hover:underline cursor-pointer ml-1">필터 초기화</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
