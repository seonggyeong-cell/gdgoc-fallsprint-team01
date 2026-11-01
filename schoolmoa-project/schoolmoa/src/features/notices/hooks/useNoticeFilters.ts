// [담당: 역할 A] 검색·카테고리·상태·정렬 로직
import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_FILTERS } from '@/config/constants';
import type { FilterState, NoticeItem } from '@/types';
import { calculateDDay } from '@/utils/dateUtils';

/** recommendedIds: 로그인 상태에서 '맞춤 추천만 보기'에 쓸 공고 id 집합 (비로그인이면 null) */
export function useNoticeFilters(notices: NoticeItem[], recommendedIds: Set<string> | null) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  // 마감 포함 여부만 반영한 기본 목록 (카테고리 개수 계산용)
  const visible = useMemo(
    () => (filters.includeClosed ? notices : notices.filter((n) => calculateDDay(n.deadline, n.isOngoing).status !== 'closed')),
    [notices, filters.includeClosed],
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: visible.length };
    for (const n of visible) counts[n.category] = (counts[n.category] ?? 0) + 1;
    return counts;
  }, [visible]);

  const availableSubcategories = useMemo(() => {
    if (filters.category === 'all') return [];
    return Array.from(new Set(visible.filter((n) => n.category === filters.category).map((n) => n.subcategory)));
  }, [visible, filters.category]);

  const filtered = useMemo(() => {
    const q = filters.searchQuery.toLowerCase().trim();
    return visible
      .filter((n) => {
        if (filters.category !== 'all' && n.category !== filters.category) return false;
        if (filters.subcategory !== 'all' && n.subcategory !== filters.subcategory) return false;
        if (filters.source !== 'all' && n.source !== filters.source) return false;
        if (filters.status !== 'all') {
          const d = calculateDDay(n.deadline, n.isOngoing);
          if (filters.status === 'closing-soon' && (n.isOngoing || d.diffDays < 0 || d.diffDays > 7)) return false;
          if (filters.status === 'recruiting' && d.diffDays < 0) return false;
          if (filters.status === 'ongoing' && !n.isOngoing) return false;
        }
        if (q) {
          const hay = [n.title, n.organizer, n.subcategory, n.benefit, n.summary, ...n.tags].join(' ').toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (filters.onlyRecommended && recommendedIds && !recommendedIds.has(n.id)) return false;
        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'latest':
            return b.createdAt.localeCompare(a.createdAt);
          case 'popular':
            return b.views + b.bookmarkedCount * 5 - (a.views + a.bookmarkedCount * 5);
          case 'benefit':
            return (b.estimatedValueNumber ?? 0) - (a.estimatedValueNumber ?? 0);
          default: {
            const dA = calculateDDay(a.deadline, a.isOngoing);
            const dB = calculateDDay(b.deadline, b.isOngoing);
            if (dA.diffDays < 0 !== dB.diffDays < 0) return dA.diffDays < 0 ? 1 : -1; // 마감된 공고는 뒤로
            if (!!a.isOngoing !== !!b.isOngoing) return a.isOngoing ? 1 : -1;       // 상시모집은 진행중 공고 뒤로
            return dA.diffDays - dB.diffDays;
          }
        }
      });
  }, [visible, filters, recommendedIds]);

  return { filters, setFilters, resetFilters, filtered, categoryCounts, availableSubcategories };
}
