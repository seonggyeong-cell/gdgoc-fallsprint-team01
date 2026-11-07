import React from 'react';
import { Star, CheckCircle2, Sparkles } from 'lucide-react';
import { NoticeItem, StudentProfile, BookmarkRecord } from '../types/notice';
import { DDayBlock } from './DDayBlock';
import { CATEGORIES } from '../constants/categories';
import { SOURCE_TIERS } from '../constants/sourceTiers';
import { DEPARTMENT_MAP } from '../constants/departments';

interface NoticeCardProps {
  notice: NoticeItem;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onSelectNotice: (notice: NoticeItem) => void;
  profile?: StudentProfile;
  record?: BookmarkRecord;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({
  notice,
  isBookmarked,
  onToggleBookmark,
  onSelectNotice,
  profile,
  record,
}) => {
  const cat = CATEGORIES[notice.category] || CATEGORIES.academic;
  const Icon = cat.icon;
  const tier = SOURCE_TIERS[notice.sourceTier] || SOURCE_TIERS['inha-main'];
  const TierIcon = tier.icon;

  return (
    <div
      onClick={() => onSelectNotice(notice)}
      className="bg-white rounded-[16px] border border-[#E3E8F0] hover:border-[#1D5FC4]/50 hover:shadow-xs transition-all p-4 flex items-start gap-4 cursor-pointer group relative"
    >
      {/* Left: 58px Square D-Day Block */}
      <DDayBlock deadline={notice.deadline} isOngoing={notice.isOngoing} />

      {/* Right: Content Information */}
      <div className="flex-1 min-w-0 pr-6">
        {/* Row 1: Source Tier Badge + Category Tag + Source Site */}
        <div className="flex flex-wrap items-center gap-1.5 text-[12px] mb-1.5">
          {/* Source Tier Badge (인하대 본교 / 인하대 학과 / 외부 공고) */}
          <span
            className="inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded-[6px] border shrink-0"
            style={{
              backgroundColor: tier.bgColor,
              borderColor: `${tier.color}33`,
              color: tier.color,
            }}
            title={tier.description}
          >
            <TierIcon className="w-3 h-3 shrink-0" />
            <span>{tier.badgeLabel}</span>
          </span>

          {/* Department Badge if applicable */}
          {notice.department && (
            <span
              className={`inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded-[6px] border shrink-0 ${
                DEPARTMENT_MAP[notice.department]?.badgeClass || 'bg-[#F0FDF4] text-[#15803D] border-[#16A34A]/30'
              }`}
            >
              <span>{notice.department}</span>
            </span>
          )}

          {/* Category Tag */}
          <span
            className="inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded-[6px] shrink-0"
            style={{
              backgroundColor: cat.bgColorClass.replace('bg-[', '').replace(']', ''),
              color: cat.color,
            }}
          >
            <Icon className="w-3 h-3 shrink-0" />
            <span>{cat.label}</span>
          </span>

          {/* Submitted / Accepted Badge */}
          {record?.stage === 'submitted' && (
            <span className="inline-flex items-center gap-1 font-extrabold text-[11px] px-2 py-0.5 rounded-[6px] bg-[#EAF8F1] text-[#0E9F6E] border border-[#0E9F6E]/30 shrink-0">
              <CheckCircle2 className="w-3 h-3" />
              <span>지원 완료</span>
            </span>
          )}
          {record?.stage === 'accepted' && (
            <span className="inline-flex items-center gap-1 font-extrabold text-[11px] px-2 py-0.5 rounded-[6px] bg-[#F5F3FF] text-[#7C3AED] border border-[#7C3AED]/30 shrink-0">
              <Sparkles className="w-3 h-3" />
              <span>최종 합격</span>
            </span>
          )}

          <span className="text-neutral-300">·</span>
          <span className="text-neutral-500 font-medium truncate max-w-[140px]">
            {notice.sourceSiteName || notice.organizer}
          </span>
          {notice.subcategory && (
            <>
              <span className="text-neutral-300 hidden sm:inline">·</span>
              <span className="text-neutral-400 hidden sm:inline truncate max-w-[110px]">
                {notice.subcategory}
              </span>
            </>
          )}
        </div>

        {/* Row 2: Title (2 lines max) */}
        <h3 className="text-[15px] sm:text-[16px] font-bold text-[#0F172A] group-hover:text-[#1D5FC4] transition-colors leading-snug line-clamp-2 mb-1.5">
          {notice.title}
        </h3>

        {/* Row 3: Benefit Highlight & Recommendation Reason Chip */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <div className="text-[13px] font-bold text-[#1D5FC4] leading-tight truncate">
            {notice.benefit}
          </div>

          {notice.recommendationReason && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5B4BD1] bg-[#F2EFFF] border border-[#5B4BD1]/20 px-2 py-0.5 rounded-full shrink-0">
              <span>{notice.recommendationReason}</span>
            </span>
          )}
        </div>
      </div>

      {/* Top Right: Bookmark Star Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleBookmark(notice.id);
        }}
        className={`absolute top-3.5 right-3.5 p-1.5 rounded-[8px] transition-transform hover:scale-110 cursor-pointer ${
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
    </div>
  );
};
