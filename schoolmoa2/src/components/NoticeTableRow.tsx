import React from 'react';
import { Star, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';
import { NoticeItem, StudentProfile, BookmarkRecord } from '../types/notice';
import { DDayBlock } from './DDayBlock';
import { CATEGORIES } from '../constants/categories';
import { SOURCE_TIERS } from '../constants/sourceTiers';
import { DEPARTMENT_MAP } from '../constants/departments';

interface NoticeTableRowProps {
  notice: NoticeItem;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onSelectNotice: (notice: NoticeItem) => void;
  profile?: StudentProfile;
  record?: BookmarkRecord;
}

export const NoticeTableRow: React.FC<NoticeTableRowProps> = ({
  notice,
  isBookmarked,
  onToggleBookmark,
  onSelectNotice,
  record,
}) => {
  const cat = CATEGORIES[notice.category] || CATEGORIES.academic;
  const Icon = cat.icon;
  const tier = SOURCE_TIERS[notice.sourceTier] || SOURCE_TIERS['inha-main'];
  const TierIcon = tier.icon;

  return (
    <tr
      onClick={() => onSelectNotice(notice)}
      className="group hover:bg-[#F8FAFC] transition-colors border-b border-[#E3E8F0] cursor-pointer"
    >
      {/* 1. D-Day Block First Column */}
      <td className="py-3 pl-4 pr-2 whitespace-nowrap w-[70px]">
        <DDayBlock
          deadline={notice.deadline}
          isOngoing={notice.isOngoing}
          size="sm"
        />
      </td>

      {/* 2. Source Tier & Category */}
      <td className="py-3 px-3 whitespace-nowrap">
        <div className="flex flex-wrap items-center gap-1 mb-1">
          <span
            className="inline-flex items-center gap-1 font-bold text-[10px] px-1.5 py-0.2 rounded border"
            style={{
              backgroundColor: tier.bgColor,
              borderColor: `${tier.color}33`,
              color: tier.color,
            }}
          >
            <TierIcon className="w-2.5 h-2.5 shrink-0" />
            <span>{tier.badgeLabel}</span>
          </span>

          {notice.department && (
            <span
              className={`inline-flex items-center font-bold text-[10px] px-1.5 py-0.2 rounded border ${
                DEPARTMENT_MAP[notice.department]?.badgeClass || 'bg-[#F0FDF4] text-[#15803D] border-[#16A34A]/30'
              }`}
            >
              <span>{notice.department}</span>
            </span>
          )}

          <span
            className="inline-flex items-center gap-1 font-bold text-[10px] px-1.5 py-0.2 rounded"
            style={{
              backgroundColor: cat.bgColorClass.replace('bg-[', '').replace(']', ''),
              color: cat.color,
            }}
          >
            <Icon className="w-2.5 h-2.5 shrink-0" />
            <span>{cat.shortLabel}</span>
          </span>
        </div>
        <div className="text-[11px] text-neutral-500 font-medium truncate max-w-[130px]">
          {notice.sourceSiteName || notice.organizer}
        </div>
      </td>

      {/* 3. Title & Recommendation Chip */}
      <td className="py-3 px-3">
        <div className="text-[14px] font-bold text-[#0F172A] group-hover:text-[#1D5FC4] transition-colors line-clamp-1">
          {notice.title}
        </div>
        <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400">
          {record?.stage === 'submitted' && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-[#0E9F6E] bg-[#EAF8F1] px-1.5 py-0.2 rounded-full border border-[#0E9F6E]/30">
              <CheckCircle2 className="w-3 h-3" />
              <span>지원 완료</span>
            </span>
          )}
          {record?.stage === 'accepted' && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-[#7C3AED] bg-[#F5F3FF] px-1.5 py-0.2 rounded-full border border-[#7C3AED]/30">
              <Sparkles className="w-3 h-3" />
              <span>최종 합격</span>
            </span>
          )}
          <span>{notice.subcategory}</span>
          <span className="text-neutral-300">·</span>
          <span>{notice.targetAudience}</span>
          {notice.recommendationReason && (
            <span className="text-[#5B4BD1] font-semibold bg-[#F2EFFF] px-1.5 py-0.2 rounded">
              {notice.recommendationReason}
            </span>
          )}
        </div>
      </td>

      {/* 4. Benefit */}
      <td className="py-3 px-3 text-[13px] font-bold text-[#1D5FC4] whitespace-nowrap">
        <div className="max-w-[220px] truncate" title={notice.benefit}>
          {notice.benefit}
        </div>
      </td>

      {/* 5. Bookmark & Action */}
      <td className="py-3 pl-2 pr-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onToggleBookmark(notice.id)}
            className={`p-1.5 rounded-[8px] transition-transform hover:scale-110 cursor-pointer ${
              isBookmarked
                ? 'text-amber-500 bg-amber-50'
                : 'text-neutral-300 hover:text-neutral-600 hover:bg-neutral-100'
            }`}
            title={isBookmarked ? '보관함에서 제거' : '보관함에 저장'}
          >
            <Star
              className="w-4 h-4"
              fill={isBookmarked ? 'currentColor' : 'none'}
              strokeWidth={2}
            />
          </button>

          <button
            onClick={() => onSelectNotice(notice)}
            className="p-1.5 text-neutral-400 hover:text-[#1D5FC4] transition-colors cursor-pointer"
            title="상세보기"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};
