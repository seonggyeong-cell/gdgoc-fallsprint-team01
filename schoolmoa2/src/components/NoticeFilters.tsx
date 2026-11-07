import React, { useState } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Check,
  RotateCcw,
  School,
  GraduationCap,
  Globe2,
  Building2,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';
import { NoticeCategory, NoticeSourceTier } from '../types/notice';
import { CATEGORY_LIST, CATEGORIES } from '../constants/categories';
import { SOURCE_TIERS, SOURCE_TIER_LIST } from '../constants/sourceTiers';
import { INHA_DEPARTMENTS, INHA_COLLEGES, DEPARTMENT_MAP } from '../constants/departments';

export interface FilterState {
  sourceTier: NoticeSourceTier | 'all';
  department: string; // 'all' or specific department name (기계공학과, 경영학과, 물리학과, 에너지자원공학과 등)
  category: NoticeCategory | 'all';
  subcategory: string;
  sourceSite: string; // 'all' or specific site name
  grade: number; // 0 for all
  status: 'all' | 'recruiting' | 'closing-soon' | 'ongoing';
  sortBy: 'deadline' | 'latest' | 'popular' | 'benefit';
  searchQuery: string;
  onlyEligible: boolean;
  hideSubmitted?: boolean;
}

interface NoticeFiltersProps {
  filters: FilterState;
  onChangeFilters: (next: FilterState) => void;
  viewMode: 'grid' | 'table';
  onChangeViewMode: (mode: 'grid' | 'table') => void;
  categoryCounts: Record<string, number>;
  sourceTierCounts: Record<string, number>;
  departmentCounts: Record<string, number>;
  sourceSiteOptions: string[];
  totalResultsCount: number;
}

export const NoticeFilters: React.FC<NoticeFiltersProps> = ({
  filters,
  onChangeFilters,
  viewMode,
  onChangeViewMode,
  categoryCounts,
  sourceTierCounts,
  departmentCounts,
  sourceSiteOptions,
  totalResultsCount,
}) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleSourceTierClick = (tier: NoticeSourceTier | 'all') => {
    onChangeFilters({
      ...filters,
      sourceTier: tier,
    });
  };

  const handleCategoryClick = (cat: NoticeCategory | 'all') => {
    onChangeFilters({
      ...filters,
      category: cat,
      subcategory: 'all',
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFilters({
      ...filters,
      searchQuery: e.target.value,
    });
  };

  const handleClearSearch = () => {
    onChangeFilters({
      ...filters,
      searchQuery: '',
    });
  };

  const handleResetAll = () => {
    onChangeFilters({
      sourceTier: 'all',
      department: 'all',
      category: 'all',
      subcategory: 'all',
      sourceSite: 'all',
      grade: 0,
      status: 'all',
      sortBy: 'deadline',
      searchQuery: '',
      onlyEligible: false,
      hideSubmitted: false,
    });
  };

  const hasNonCategoryFilters =
    filters.sourceTier !== 'all' ||
    filters.department !== 'all' ||
    filters.sourceSite !== 'all' ||
    filters.grade !== 0 ||
    filters.status !== 'all' ||
    filters.searchQuery.trim() !== '' ||
    filters.onlyEligible ||
    !!filters.hideSubmitted;

  return (
    <div className="space-y-3.5 mb-5">
      {/* 1. Main Requirement: Primary Source Tier Segmented Selector (인하대 본교 / 인하대 학과 / 외부 사이트) */}
      <div className="bg-white rounded-[14px] p-1.5 border border-[#E3E8F0] shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {/* All */}
          <button
            onClick={() => handleSourceTierClick('all')}
            className={`flex-1 min-w-[110px] py-2 px-3 rounded-[10px] text-[13px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              filters.sourceTier === 'all'
                ? 'bg-[#0B2A5B] text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span>전체 출처</span>
            <span
              className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums ${
                filters.sourceTier === 'all' ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
              }`}
            >
              {sourceTierCounts.all || 0}
            </span>
          </button>

          {/* 인하대 본교 공고 */}
          <button
            onClick={() => handleSourceTierClick('inha-main')}
            className={`flex-1 min-w-[130px] py-2 px-3 rounded-[10px] text-[13px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              filters.sourceTier === 'inha-main'
                ? 'bg-[#0B2A5B] text-white shadow-xs'
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-[#EEF4FF]/50'
            }`}
          >
            <School className="w-4 h-4 shrink-0 text-[#1D5FC4]" />
            <span>인하대 본교</span>
            <span
              className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums ${
                filters.sourceTier === 'inha-main' ? 'bg-white/20 text-white' : 'bg-[#EEF4FF] text-[#0B2A5B]'
              }`}
            >
              {sourceTierCounts['inha-main'] || 0}
            </span>
          </button>

          {/* 인하대 학과 공고 */}
          <button
            onClick={() => handleSourceTierClick('inha-dept')}
            className={`flex-1 min-w-[130px] py-2 px-3 rounded-[10px] text-[13px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              filters.sourceTier === 'inha-dept'
                ? 'bg-[#15803D] text-white shadow-xs'
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-[#F0FDF4]/60'
            }`}
          >
            <GraduationCap className="w-4 h-4 shrink-0 text-[#16A34A]" />
            <span>인하대 학과/연구실</span>
            <span
              className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums ${
                filters.sourceTier === 'inha-dept' ? 'bg-white/20 text-white' : 'bg-[#F0FDF4] text-[#15803D]'
              }`}
            >
              {sourceTierCounts['inha-dept'] || 0}
            </span>
          </button>

          {/* 외부 사이트 공고 */}
          <button
            onClick={() => handleSourceTierClick('external')}
            className={`flex-1 min-w-[130px] py-2 px-3 rounded-[10px] text-[13px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              filters.sourceTier === 'external'
                ? 'bg-[#475569] text-white shadow-xs'
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
          >
            <Globe2 className="w-4 h-4 shrink-0 text-[#64708A]" />
            <span>외부 사이트 공고</span>
            <span
              className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums ${
                filters.sourceTier === 'external' ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {sourceTierCounts['external'] || 0}
            </span>
          </button>
        </div>
      </div>

      {/* 1.1 Inha Department Sub-category Selector (기계공학과, 경영학과, 물리학과, 에너지자원공학과 등) */}
      {(filters.sourceTier === 'inha-dept' || filters.department !== 'all') && (
        <div className="bg-[#F0FDF4]/90 rounded-[14px] p-3.5 border border-[#16A34A]/30 shadow-xs animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-[6px] bg-[#15803D] text-white flex items-center justify-center shrink-0">
                <GraduationCap className="w-3.5 h-3.5" />
              </span>
              <div>
                <h4 className="text-[13px] font-extrabold text-[#15803D] flex items-center gap-1.5">
                  <span>인하대 학과별 세부 분류</span>
                  <span className="text-[11px] font-semibold text-neutral-500 hidden sm:inline">
                    (기계공학 · 경영 · 물리 · 에너지자원 · 컴공 등 1-클릭 필터)
                  </span>
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-[11px] text-neutral-500 font-medium">
                선택된 학과: <strong className="text-[#15803D]">{filters.department === 'all' ? '전체 학과' : filters.department}</strong>
              </span>
              {filters.department !== 'all' && (
                <button
                  type="button"
                  onClick={() => onChangeFilters({ ...filters, department: 'all' })}
                  className="text-[11px] font-bold text-neutral-500 hover:text-[#15803D] underline cursor-pointer"
                >
                  초기화
                </button>
              )}
            </div>
          </div>

          {/* Department Chips List */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {/* All Departments */}
            <button
              type="button"
              onClick={() => onChangeFilters({ ...filters, sourceTier: 'inha-dept', department: 'all' })}
              className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                filters.department === 'all'
                  ? 'bg-[#15803D] text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200'
              }`}
            >
              전체 학과 ({sourceTierCounts['inha-dept'] || 0})
            </button>

            {/* Department buttons */}
            {INHA_DEPARTMENTS.map((dept) => {
              const count = departmentCounts[dept.name] || 0;
              const isSelected = filters.department === dept.name;
              return (
                <button
                  type="button"
                  key={dept.id}
                  onClick={() =>
                    onChangeFilters({
                      ...filters,
                      sourceTier: 'inha-dept',
                      department: dept.name,
                    })
                  }
                  className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border shadow-xs ${
                    isSelected
                      ? 'shadow-sm'
                      : 'bg-white hover:bg-neutral-50'
                  }`}
                  style={{
                    backgroundColor: isSelected ? dept.color : '#ffffff',
                    color: isSelected ? '#ffffff' : dept.color,
                    borderColor: isSelected ? dept.color : `${dept.color}40`,
                  }}
                  title={`${dept.college} · ${dept.description}`}
                >
                  <span>{dept.name}</span>
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums ${
                      isSelected ? 'bg-white/30 text-white' : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Search Bar + View Toggle + Filter Modal Trigger */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder="공고명, 출처, 혜택, 키워드 검색... (예: 수강정정, 국가장학금, 인턴, 해커톤)"
            className="w-full pl-10 pr-9 py-2.5 text-[13px] bg-white border border-[#E3E8F0] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1D5FC4] transition-all text-[#0F172A] placeholder:text-neutral-400 shadow-xs"
          />
          {filters.searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-0.5 cursor-pointer"
              title="검색어 지우기"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Tools: Filter Details Modal Button & View Mode (Grid/Table) */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Detailed Filter Button */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className={`py-2 px-3.5 rounded-[10px] text-[12px] font-bold border transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs ${
              hasNonCategoryFilters
                ? 'bg-[#0B2A5B] text-white border-[#0B2A5B]'
                : 'bg-white text-neutral-700 border-[#E3E8F0] hover:bg-neutral-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>세부 조건</span>
            {hasNonCategoryFilters && (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>

          {/* 지원 완료 숨기기 Quick Toggle */}
          <button
            type="button"
            onClick={() => onChangeFilters({ ...filters, hideSubmitted: !filters.hideSubmitted })}
            className={`py-2 px-3 rounded-[10px] text-[12px] font-bold border transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs ${
              filters.hideSubmitted
                ? 'bg-[#0E9F6E] text-white border-[#0E9F6E]'
                : 'bg-white text-neutral-700 border-[#E3E8F0] hover:bg-neutral-50'
            }`}
            title="지원 완료(제출 완료 및 합격)된 공고를 목록에서 숨깁니다"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">지원 완료 숨김</span>
            <span className="sm:hidden">완료숨김</span>
          </button>

          {/* Sort Selector */}
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onChangeFilters({
                ...filters,
                sortBy: e.target.value as FilterState['sortBy'],
              })
            }
            className="py-2 px-2.5 text-[12px] font-semibold bg-white border border-[#E3E8F0] rounded-[10px] text-neutral-700 focus:outline-none focus:ring-1 focus:ring-[#1D5FC4] cursor-pointer shadow-xs"
          >
            <option value="deadline">마감일순 (D-Day)</option>
            <option value="latest">최신순</option>
            <option value="popular">조회/인기순</option>
            <option value="benefit">지원규모순</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-white p-0.5 rounded-[10px] border border-[#E3E8F0] shadow-xs">
            <button
              onClick={() => onChangeViewMode('grid')}
              className={`p-1.5 rounded-[8px] transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#0B2A5B] text-white'
                  : 'text-neutral-400 hover:text-neutral-700'
              }`}
              title="카드 보기"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangeViewMode('table')}
              className={`p-1.5 rounded-[8px] transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#0B2A5B] text-white'
                  : 'text-neutral-400 hover:text-neutral-700'
              }`}
              title="목록 보기"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. 7 Category Chips (Always Visible in 1 Row) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {/* All Tab */}
        <button
          onClick={() => handleCategoryClick('all')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
            filters.category === 'all'
              ? 'bg-[#0B2A5B] text-white shadow-xs'
              : 'bg-white text-neutral-600 hover:text-neutral-900 border border-[#E3E8F0]'
          }`}
        >
          <span>모든 분야</span>
          <span className="text-[11px] opacity-80 tabular-nums">
            {categoryCounts.all || 0}
          </span>
        </button>

        {/* 7 Categories */}
        {CATEGORY_LIST.map((cat) => {
          const isSelected = filters.category === cat.key;
          const count = categoryCounts[cat.key] || 0;

          return (
            <button
              key={cat.key}
              onClick={() => handleCategoryClick(cat.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-[#0B2A5B] text-white border-[#0B2A5B] shadow-xs'
                  : 'bg-white text-neutral-700 border-[#E3E8F0] hover:bg-neutral-50'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span>{cat.label}</span>
              <span
                className={`text-[11px] tabular-nums font-semibold ${
                  isSelected ? 'text-white/80' : 'text-neutral-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Filter Badges Bar */}
      {(hasNonCategoryFilters || filters.category !== 'all' || filters.sourceTier !== 'all') && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[12px]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-neutral-400 font-medium">적용 필터:</span>

            {/* Source Tier Badge */}
            {filters.sourceTier !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[6px] bg-[#EEF4FF] text-[#0B2A5B] border border-[#1D5FC4]/30 font-bold text-[11px]">
                <span>출처: {SOURCE_TIERS[filters.sourceTier]?.label}</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-rose-500"
                  onClick={() => handleSourceTierClick('all')}
                />
              </span>
            )}

            {filters.category !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-neutral-100 text-[#0F172A] font-bold text-[11px]">
                <span>분야: {CATEGORIES[filters.category]?.label}</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-rose-500"
                  onClick={() => handleCategoryClick('all')}
                />
              </span>
            )}

            {filters.sourceSite !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-neutral-100 text-[#0F172A] font-bold text-[11px]">
                <span>세부 사이트: {filters.sourceSite}</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-rose-500"
                  onClick={() => onChangeFilters({ ...filters, sourceSite: 'all' })}
                />
              </span>
            )}

            {filters.grade !== 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-neutral-100 text-[#0F172A] font-bold text-[11px]">
                <span>{filters.grade}학년 대상</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-rose-500"
                  onClick={() => onChangeFilters({ ...filters, grade: 0 })}
                />
              </span>
            )}

            {filters.status !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-neutral-100 text-[#0F172A] font-bold text-[11px]">
                <span>
                  {filters.status === 'closing-soon'
                    ? '마감임박 (D-7)'
                    : filters.status === 'ongoing'
                      ? '상시모집'
                      : '접수중'}
                </span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-rose-500"
                  onClick={() => onChangeFilters({ ...filters, status: 'all' })}
                />
              </span>
            )}

            {filters.onlyEligible && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-[#EEF4FF] text-[#1D5FC4] font-bold text-[11px]">
                <span>내 조건 지원 가능만</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-rose-500"
                  onClick={() => onChangeFilters({ ...filters, onlyEligible: false })}
                />
              </span>
            )}

            {filters.hideSubmitted && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-[#EAF8F1] text-[#0E9F6E] font-bold text-[11px] border border-[#0E9F6E]/30">
                <CheckCircle2 className="w-3 h-3" />
                <span>지원 완료 숨김 적용</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-rose-500"
                  onClick={() => onChangeFilters({ ...filters, hideSubmitted: false })}
                />
              </span>
            )}

            <button
              onClick={handleResetAll}
              className="text-[11px] text-neutral-400 hover:text-neutral-700 underline cursor-pointer ml-1 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>전체 초기화</span>
            </button>
          </div>

          <div className="text-[12px] text-neutral-500 font-medium">
            총 <strong className="text-[#0F172A] tabular-nums font-bold">{totalResultsCount}</strong>건의 공고
          </div>
        </div>
      )}

      {/* Filter Modal / BottomSheet for Clean UI */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white w-full max-w-md rounded-[16px] shadow-xl border border-[#E3E8F0] p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-extrabold text-[16px] text-[#0F172A]">
                상세 조건 필터
              </h3>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Source Tier Classification inside modal */}
            <div>
              <label className="block text-[12px] font-bold text-neutral-700 mb-1.5">
                공고 출처 분류
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => onChangeFilters({ ...filters, sourceTier: 'all' })}
                  className={`py-2 px-2 text-[12px] rounded-[8px] font-bold border transition-colors cursor-pointer ${
                    filters.sourceTier === 'all'
                      ? 'bg-[#0B2A5B] text-white border-[#0B2A5B]'
                      : 'bg-neutral-50 text-neutral-700 border-[#E3E8F0] hover:bg-neutral-100'
                  }`}
                >
                  전체 출처
                </button>
                {SOURCE_TIER_LIST.map((tier) => (
                  <button
                    key={tier.key}
                    type="button"
                    onClick={() => onChangeFilters({ ...filters, sourceTier: tier.key })}
                    className={`py-2 px-2 text-[12px] rounded-[8px] font-bold border transition-colors cursor-pointer ${
                      filters.sourceTier === tier.key
                        ? 'bg-[#0B2A5B] text-white border-[#0B2A5B]'
                        : 'bg-neutral-50 text-neutral-700 border-[#E3E8F0] hover:bg-neutral-100'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Department Option (인하대 학과 세부 분류) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[12px] font-bold text-neutral-700">
                  인하대 세부 학과 선택
                </label>
                {filters.department !== 'all' && (
                  <button
                    type="button"
                    onClick={() => onChangeFilters({ ...filters, department: 'all' })}
                    className="text-[11px] text-[#15803D] font-bold hover:underline"
                  >
                    전체 학과로 리셋
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => onChangeFilters({ ...filters, department: 'all' })}
                  className={`py-1.5 px-2 text-[11px] rounded-[8px] font-bold border transition-colors cursor-pointer ${
                    filters.department === 'all'
                      ? 'bg-[#15803D] text-white border-[#15803D]'
                      : 'bg-neutral-50 text-neutral-700 border-[#E3E8F0] hover:bg-neutral-100'
                  }`}
                >
                  전체 학과
                </button>
                {INHA_DEPARTMENTS.map((dept) => (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() =>
                      onChangeFilters({
                        ...filters,
                        sourceTier: 'inha-dept',
                        department: dept.name,
                      })
                    }
                    className={`py-1.5 px-2 text-[11px] rounded-[8px] font-bold border transition-colors cursor-pointer ${
                      filters.department === dept.name
                        ? 'bg-[#15803D] text-white border-[#15803D]'
                        : 'bg-neutral-50 text-neutral-700 border-[#E3E8F0] hover:bg-neutral-100'
                    }`}
                  >
                    {dept.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Specific Source Site Option */}
            <div>
              <label className="block text-[12px] font-bold text-neutral-700 mb-1.5">
                세부 연계 출처
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {['all', ...sourceSiteOptions].map((src) => (
                  <button
                    key={src}
                    onClick={() => onChangeFilters({ ...filters, sourceSite: src })}
                    className={`px-2.5 py-1 text-[12px] rounded-[6px] font-medium transition-colors cursor-pointer border ${
                      filters.sourceSite === src
                        ? 'bg-[#0B2A5B] text-white border-[#0B2A5B]'
                        : 'bg-neutral-50 text-neutral-700 border-[#E3E8F0] hover:bg-neutral-100'
                    }`}
                  >
                    {src === 'all' ? '전체 사이트' : src}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Grade Option */}
            <div>
              <label className="block text-[12px] font-bold text-neutral-700 mb-1.5">
                대상 학년
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { label: '전체', val: 0 },
                  { label: '1학년', val: 1 },
                  { label: '2학년', val: 2 },
                  { label: '3학년', val: 3 },
                  { label: '4학년+', val: 4 },
                ].map((g) => (
                  <button
                    key={g.val}
                    onClick={() => onChangeFilters({ ...filters, grade: g.val })}
                    className={`py-1.5 text-center text-[12px] rounded-[6px] font-medium transition-colors cursor-pointer border ${
                      filters.grade === g.val
                        ? 'bg-[#0B2A5B] text-white border-[#0B2A5B]'
                        : 'bg-neutral-50 text-neutral-700 border-[#E3E8F0] hover:bg-neutral-100'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Option */}
            <div>
              <label className="block text-[12px] font-bold text-neutral-700 mb-1.5">
                모집 마감 상태
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: '전체', val: 'all' as const },
                  { label: '접수중', val: 'recruiting' as const },
                  { label: '마감임박(D-7)', val: 'closing-soon' as const },
                  { label: '상시모집', val: 'ongoing' as const },
                ].map((s) => (
                  <button
                    key={s.val}
                    onClick={() => onChangeFilters({ ...filters, status: s.val })}
                    className={`py-1.5 text-center text-[12px] rounded-[6px] font-medium transition-colors cursor-pointer border ${
                      filters.status === s.val
                        ? 'bg-[#0B2A5B] text-white border-[#0B2A5B]'
                        : 'bg-neutral-50 text-neutral-700 border-[#E3E8F0] hover:bg-neutral-100'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkbox: Only Eligible */}
            <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.onlyEligible}
                onChange={(e) =>
                  onChangeFilters({
                    ...filters,
                    onlyEligible: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-[#1D5FC4] focus:ring-[#1D5FC4] cursor-pointer"
              />
              <span className="text-[13px] font-bold text-neutral-800">
                내 프로필 조건(학년/학점)에 맞는 공고만 보기
              </span>
            </label>

            {/* Checkbox: Hide Submitted */}
            <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!!filters.hideSubmitted}
                onChange={(e) =>
                  onChangeFilters({
                    ...filters,
                    hideSubmitted: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-[#0E9F6E] focus:ring-[#0E9F6E] cursor-pointer"
              />
              <span className="text-[13px] font-bold text-neutral-800 flex items-center gap-1.5">
                <EyeOff className="w-3.5 h-3.5 text-[#0E9F6E]" />
                <span>지원 완료(제출 완료 및 합격)된 공고 숨기기</span>
              </span>
            </label>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <button
                onClick={handleResetAll}
                className="text-[12px] text-neutral-400 hover:text-neutral-700 underline cursor-pointer"
              >
                필터 초기화
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="py-2 px-5 bg-[#0B2A5B] hover:bg-[#1D5FC4] text-white text-[13px] font-bold rounded-[10px] transition-colors cursor-pointer"
              >
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
