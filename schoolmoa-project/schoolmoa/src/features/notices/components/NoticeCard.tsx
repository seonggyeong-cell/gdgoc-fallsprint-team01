// [담당: 역할 A] 공고 카드 (그리드 뷰)
import React from 'react';
import { Bookmark, ChevronRight, ExternalLink, Sparkles } from 'lucide-react';
import { CATEGORY_LABELS, SOURCES } from '@/config/constants';
import type { NoticeItem } from '@/types';
import { calculateDDay, formatDeadlineLabel } from '@/utils/dateUtils';

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
            <span className="truncate max-w-[140px]">{SOURCES[notice.source].label}</span>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggleBookmark(notice.id); }}
            className={`p-1.5 rounded-md transition-colors cursor-pointer shrink-0 ${
              isBookmarked ? 'text-rose-600 bg-rose-50 hover:bg-rose-100' : 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100'
            }`}
            title={isBookmarked ? '관심 보관함에서 제거' : '관심 공고로 보관'}
          >
            <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>

        <h3
          onClick={() => onSelectNotice(notice)}
          className="text-base font-semibold text-neutral-900 group-hover:text-indigo-600 transition-colors leading-snug cursor-pointer mb-2 line-clamp-2"
          style={{ textWrap: 'balance' }}
        >
          {notice.title}
        </h3>

        <p className="text-xs text-neutral-600 line-clamp-2 mb-3.5 leading-relaxed">{notice.summary}</p>

        <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-100 mb-3 text-xs flex items-center gap-1.5 font-medium text-neutral-900">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="truncate">{notice.benefit}</span>
        </div>

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
            href={notice.officialUrl} target="_blank" rel="noreferrer noopener"
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
