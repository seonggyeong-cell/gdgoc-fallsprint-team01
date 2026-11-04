// [담당: 역할 A] 공고 카드 (그리드 뷰)
import React from 'react';
import { Bookmark, ChevronRight, ExternalLink, Sparkles } from 'lucide-react';
import { CATEGORY_LABELS, SOURCES } from '@/config/constants';
import type { NoticeItem } from '@/types';
import { calculateDDay, formatDeadlineLabel } from '@/utils/dateUtils';
import { sanitizeUrl } from '@/utils/urlUtils';

interface NoticeCardProps {
  notice: NoticeItem;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onSelectNotice: (notice: NoticeItem) => void;
  reasons?: string[]; // 맞춤 추천 이유
}

export const NoticeCard: React.FC<NoticeCardProps> = ({ notice, isBookmarked, onToggleBookmark, onSelectNotice, reasons }) => {
  const dDay = calculateDDay(notice.deadline, notice.isOngoing);

  return (
    <article className="group bg-white rounded-xl border border-neutral-200/90 hover:border-neutral-300 p-5 flex flex-col justify-between transition-all hover:shadow-sm">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
            <span className="font-semibold text-neutral-800">{CATEGORY_LABELS[notice.category]}</span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span>{notice.subcategory}</span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span className="text-neutral-600">{notice.organizer}</span>
            {notice.source !== 'user' && (
              <>
                <span aria-hidden="true" className="text-neutral-300">·</span>
                <span className="text-[11px] text-neutral-400">출처: {SOURCES[notice.source]?.label ?? notice.source}</span>
              </>
            )}
            {notice.isUserSubmitted && (
              <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded font-medium border border-sky-200">제보</span>
            )}
            {reasons && reasons.length > 0 && (
              <span className="inline-flex items-center gap-0.5 text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-medium border border-indigo-200">
                <Sparkles className="w-2.5 h-2.5" /> 맞춤 추천
              </span>
            )}
          </div>

          <button
            onClick={() => onToggleBookmark(notice.id)}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-amber-50 border-amber-200 text-amber-600'
                : 'border-neutral-200 text-neutral-400 hover:text-neutral-700 hover:border-neutral-300'
            }`}
            title={isBookmarked ? '보관함에서 제거' : '보관함에 저장'}
            aria-label={isBookmarked ? '보관함에서 제거' : '보관함에 저장'}
          >
            <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>

        <h3
          onClick={() => onSelectNotice(notice)}
          className="text-base font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2 leading-snug mb-2"
        >
          {notice.title}
        </h3>

        {notice.benefit && (
          <p className="text-xs font-semibold text-indigo-700 mb-2">{notice.benefit}</p>
        )}

        {reasons && reasons.length > 0 && (
          <p className="text-[11px] text-indigo-700 mb-2">추천 이유: {reasons.slice(0, 2).join(' · ')}</p>
        )}
      </div>

      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2 mt-1">
        <div className="flex flex-col gap-1">
          <span className={`self-start text-xs px-2 py-0.5 rounded border tabular-nums ${dDay.badgeColorClass}`}>{dDay.dDayText}</span>
          <span className="text-[11px] text-neutral-500 tabular-nums">
            {notice.isOngoing ? '마감일 없음 (상시)' : `마감 ${formatDeadlineLabel(notice.deadline)}`}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <a
            href={sanitizeUrl(notice.officialUrl)} target="_blank" rel="noreferrer noopener"
            className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-indigo-600 py-1 px-2 rounded hover:bg-neutral-100 transition-colors"
            title="원문 사이트 열기"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>원문</span>
          </a>
          <button
            onClick={() => onSelectNotice(notice)}
            className="inline-flex items-center gap-1 text-xs font-medium text-neutral-700 hover:text-indigo-600 py-1 px-2 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <span>상세보기</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
