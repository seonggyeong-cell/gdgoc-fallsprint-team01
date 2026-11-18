// [담당: 역할 A] 공고 카드 (그리드 뷰)
import React from 'react';
import { Bookmark, ChevronRight, ExternalLink, Sparkles } from 'lucide-react';
import { CATEGORY_LABELS, SOURCES } from '@/config/constants';
import type { NoticeItem } from '@/types';
import { calculateDDay, formatDeadlineLabel } from '@/utils/dateUtils';
import { resolveNoticeUrl } from '@/utils/urlUtils';

interface NoticeCardProps {
  notice: NoticeItem;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onSelectNotice: (notice: NoticeItem) => void;
  reasons?: string[]; // 맞춤 추천 이유
}

// 카테고리별 색상 (인하대 컬러 베이스)
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  work:        { bg: 'bg-emerald-50',  text: 'text-emerald-800', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  career:      { bg: 'bg-blue-50',     text: 'text-blue-800',    border: 'border-blue-200',    dot: 'bg-blue-600' },
  scholarship: { bg: 'bg-amber-50',    text: 'text-amber-800',   border: 'border-amber-200',   dot: 'bg-amber-500' },
  competition: { bg: 'bg-purple-50',   text: 'text-purple-800',  border: 'border-purple-200',  dot: 'bg-purple-500' },
  activity:    { bg: 'bg-pink-50',     text: 'text-pink-800',    border: 'border-pink-200',    dot: 'bg-pink-500' },
  support:     { bg: 'bg-teal-50',     text: 'text-teal-800',    border: 'border-teal-200',    dot: 'bg-teal-500' },
  academic:    { bg: 'bg-indigo-50',   text: 'text-indigo-800',  border: 'border-indigo-200',  dot: 'bg-indigo-600' },
};
const DEFAULT_COLOR = { bg: 'bg-neutral-100', text: 'text-neutral-700', border: 'border-neutral-200', dot: 'bg-neutral-400' };

export const NoticeCard: React.FC<NoticeCardProps> = ({ notice, isBookmarked, onToggleBookmark, onSelectNotice, reasons }) => {
  const dDay = calculateDDay(notice.deadline, notice.isOngoing);
  const color = CATEGORY_COLORS[notice.category] ?? DEFAULT_COLOR;

  return (
    <article className="card-lift group bg-white rounded-2xl border border-neutral-200/80 p-5 flex flex-col justify-between cursor-pointer"
             onClick={() => onSelectNotice(notice)}>
      <div>
        {/* 카테고리 배지 + 북마크 */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* 카테고리 컬러 배지 */}
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${color.bg} ${color.text} ${color.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
              {CATEGORY_LABELS[notice.category]}
            </span>
            {notice.source !== 'user' && (
              <span className="text-[10px] text-neutral-400 bg-neutral-50 border border-neutral-200 px-1.5 py-0.5 rounded-full">
                {SOURCES[notice.source]?.label ?? notice.source}
              </span>
            )}
            {notice.isUserSubmitted && (
              <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded-full font-medium border border-sky-200">제보</span>
            )}
            {reasons && reasons.length > 0 && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border"
                    style={{ background: 'var(--inha-gold-light)', color: 'var(--inha-gold)', borderColor: '#e8c84080' }}>
                <Sparkles className="w-2.5 h-2.5" /> 맞춤 추천
              </span>
            )}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onToggleBookmark(notice.id); }}
            className={`p-1.5 rounded-xl border transition-all cursor-pointer shrink-0 ${isBookmarked
              ? 'bg-amber-50 border-amber-300 text-amber-500 shadow-sm'
              : 'border-neutral-200 text-neutral-300 hover:text-amber-500 hover:border-amber-200 hover:bg-amber-50'
            }`}
            title={isBookmarked ? '보관함에서 제거' : '보관함에 저장'}
            aria-label={isBookmarked ? '보관함에서 제거' : '보관함에 저장'}
          >
            <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* 소제목 */}
        <p className="text-[11px] text-neutral-500 mb-1">{notice.subcategory} · {notice.organizer}</p>

        {/* 제목 */}
        <h3 className="text-[15px] font-bold text-neutral-900 group-hover:text-blue-800 transition-colors line-clamp-2 leading-snug mb-2.5"
            style={{ color: 'inherit' }}>
          {notice.title}
        </h3>

        {/* 혜택 */}
        {notice.benefit && (
          <p className="text-xs font-semibold mb-2 px-2.5 py-1.5 rounded-lg"
             style={{ background: 'var(--inha-blue-light)', color: 'var(--inha-blue)' }}>
            💰 {notice.benefit}
          </p>
        )}

        {/* 추천 이유 */}
        {reasons && reasons.length > 0 && (
          <p className="text-[11px] mb-2" style={{ color: 'var(--inha-gold)' }}>
            ✦ {reasons.slice(0, 2).join(' · ')}
          </p>
        )}
      </div>

      {/* 하단: D-Day + 액션 */}
      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2 mt-1">
        <div className="flex flex-col gap-0.5">
          <span className={`self-start text-xs px-2 py-0.5 rounded-full border font-semibold tabular-nums ${dDay.badgeColorClass}`}>
            {dDay.dDayText}
          </span>
          <span className="text-[10px] text-neutral-400 tabular-nums">
            {notice.isOngoing ? '마감일 없음 (상시)' : `마감 ${formatDeadlineLabel(notice.deadline)}`}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <a
            href={resolveNoticeUrl(notice)} target="_blank" rel="noreferrer noopener"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-blue-700 py-1 px-2 rounded-lg hover:bg-blue-50 transition-colors"
            title="원문 사이트 열기"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>원문</span>
          </a>
          <button
            onClick={(e) => { e.stopPropagation(); onSelectNotice(notice); }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-white py-1 px-2.5 rounded-lg transition-all shadow-sm cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #003087, #0050c8)' }}
          >
            <span>상세보기</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
