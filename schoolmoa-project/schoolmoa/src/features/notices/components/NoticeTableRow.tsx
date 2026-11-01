// [담당: 역할 A] 공고 목록 표 행 (테이블 뷰)
import React from 'react';
import { Bookmark, ChevronRight, ExternalLink } from 'lucide-react';
import { CATEGORY_LABELS, SOURCES } from '@/config/constants';
import type { NoticeItem } from '@/types';
import { calculateDDay, formatDeadlineLabel } from '@/utils/dateUtils';

interface Props {
  notice: NoticeItem;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onSelectNotice: (notice: NoticeItem) => void;
}

export const NoticeTableRow: React.FC<Props> = ({ notice, isBookmarked, onToggleBookmark, onSelectNotice }) => {
  const dDay = calculateDDay(notice.deadline, notice.isOngoing);
  const iconBtn = 'p-1.5 rounded-md transition-colors cursor-pointer text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100';

  return (
    <tr onClick={() => onSelectNotice(notice)} className="group hover:bg-neutral-50/90 transition-colors border-b border-neutral-200/80 cursor-pointer">
      <td className="py-3.5 pl-4 pr-3 text-xs text-neutral-600 whitespace-nowrap">
        <div className="font-medium text-neutral-800">{CATEGORY_LABELS[notice.category]}</div>
        <div className="text-[11px] text-neutral-400">{notice.subcategory}</div>
      </td>

      <td className="py-3.5 px-3">
        <span className="text-sm font-semibold text-neutral-900 group-hover:text-indigo-600 transition-colors">{notice.title}</span>
        <div className="text-xs text-neutral-500 mt-0.5 flex items-center gap-2">
          <span>{notice.organizer}</span>
          <span aria-hidden="true" className="text-neutral-300">·</span>
          <span>{SOURCES[notice.source].label}</span>
        </div>
      </td>

      <td className="py-3.5 px-3 text-xs text-neutral-900 font-medium whitespace-nowrap">
        <div className="max-w-[200px] truncate" title={notice.benefit}>{notice.benefit}</div>
      </td>

      <td className="py-3.5 px-3 text-xs whitespace-nowrap">
        <span className={`px-2 py-0.5 rounded border text-xs tabular-nums ${dDay.badgeColorClass}`}>{dDay.dDayText}</span>
        <div className="text-[11px] text-neutral-500 tabular-nums mt-1">{notice.isOngoing ? '상시' : formatDeadlineLabel(notice.deadline)}</div>
      </td>

      <td className="py-3.5 pl-3 pr-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onToggleBookmark(notice.id)}
            className={`${iconBtn} ${isBookmarked ? '!text-rose-600 bg-rose-50 hover:bg-rose-100' : ''}`}
            title={isBookmarked ? '관심 보관함에서 제거' : '관심 보관함 추가'}
          >
            <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
          <a href={notice.officialUrl} target="_blank" rel="noreferrer noopener" className={iconBtn} title="원문 사이트 열기">
            <ExternalLink className="w-4 h-4" />
          </a>
          <button onClick={() => onSelectNotice(notice)} className={iconBtn} title="상세보기">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};
