import React from 'react';
import { Sparkles, Calendar, Bookmark, CheckCircle2, ArrowRight, Download, Clock } from 'lucide-react';
import { NoticeItem, StudentProfile, BookmarkRecord } from '../types/notice';
import { generateAllBookmarksIcs, calculateDDay } from '../utils/dateUtils';
import { CATEGORIES } from '../constants/categories';

interface HomeWidgetsProps {
  profile: StudentProfile;
  recommendedNotices: NoticeItem[];
  bookmarkedNotices: NoticeItem[];
  records: Record<string, BookmarkRecord>;
  onSelectNotice: (notice: NoticeItem) => void;
  onGoToBookmarks: () => void;
  onGoToCalendar: () => void;
  onOpenProfile: () => void;
}

export const HomeWidgets: React.FC<HomeWidgetsProps> = ({
  profile,
  recommendedNotices,
  bookmarkedNotices,
  records,
  onSelectNotice,
  onGoToBookmarks,
  onGoToCalendar,
  onOpenProfile,
}) => {
  // Compute bookmark stages
  const stageStats = React.useMemo(() => {
    let saved = 0;
    let preparing = 0;
    let submitted = 0;
    let accepted = 0;
    let urgentCount = 0;

    for (const item of bookmarkedNotices) {
      const rec = records[item.id];
      const stage = rec?.stage || 'saved';
      if (stage === 'saved') saved++;
      else if (stage === 'preparing') preparing++;
      else if (stage === 'submitted') submitted++;
      else if (stage === 'accepted') accepted++;

      const d = calculateDDay(item.deadline, item.isOngoing);
      if (d.diffDays >= 0 && d.diffDays <= 7) {
        urgentCount++;
      }
    }

    return {
      total: bookmarkedNotices.length,
      saved,
      preparing,
      submitted,
      accepted,
      urgentCount,
    };
  }, [bookmarkedNotices, records]);

  const handleExportAllIcs = () => {
    generateAllBookmarksIcs(
      bookmarkedNotices.map((n) => ({
        title: n.title,
        deadline: n.deadline,
        benefit: n.benefit,
      }))
    );
  };

  return (
    <aside className="space-y-4">
      {/* 1. 맞춤 추천 위젯 */}
      <div className="bg-white rounded-[16px] border border-[#E3E8F0] p-4.5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-full bg-[#F2EFFF] text-[#5B4BD1] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <div>
              <div className="text-[13px] font-bold text-[#0F172A]">
                {profile.major} {profile.grade}학년 맞춤 추천
              </div>
              <div className="text-[11px] text-neutral-400">
                희망 진로: {profile.careerGoal}
              </div>
            </div>
          </div>
          <button
            onClick={onOpenProfile}
            className="text-[11px] font-medium text-neutral-400 hover:text-neutral-700 underline cursor-pointer"
          >
            설정
          </button>
        </div>

        {/* Recommended Items */}
        <div className="space-y-2.5">
          {recommendedNotices.slice(0, 3).map((notice) => {
            const cat = CATEGORIES[notice.category] || CATEGORIES.academic;
            const d = calculateDDay(notice.deadline, notice.isOngoing);

            return (
              <div
                key={notice.id}
                onClick={() => onSelectNotice(notice)}
                className="p-2.5 rounded-[10px] hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-200/60 cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.2 rounded"
                    style={{
                      backgroundColor: cat.bgColorClass.replace('bg-[', '').replace(']', ''),
                      color: cat.color,
                    }}
                  >
                    {cat.shortLabel}
                  </span>
                  <span
                    className="text-[10px] font-bold px-1.5 rounded tabular-nums"
                    style={{ backgroundColor: d.bgColor, color: d.textColor }}
                  >
                    {d.dDayText}
                  </span>
                </div>

                <div className="text-[12px] font-bold text-[#0F172A] group-hover:text-[#1D5FC4] transition-colors line-clamp-1">
                  {notice.title}
                </div>

                {notice.recommendationReason && (
                  <div className="text-[11px] text-[#5B4BD1] font-medium mt-1 truncate">
                    {notice.recommendationReason}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. 보관함 지원 진행 위젯 */}
      <div className="bg-white rounded-[16px] border border-[#E3E8F0] p-4.5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bookmark className="w-3.5 h-3.5" />
            </span>
            <div className="text-[13px] font-bold text-[#0F172A]">
              내 보관함 지원 현황
            </div>
          </div>
          <button
            onClick={onGoToBookmarks}
            className="text-[11px] font-bold text-[#1D5FC4] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>칸반 보기</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Action-Oriented Stats */}
        <div className="grid grid-cols-3 gap-2 text-center py-1 bg-neutral-50 rounded-[10px] border border-neutral-100 mb-3">
          <div>
            <div className="text-[10px] text-neutral-400 font-medium">지원 예정</div>
            <div className="text-[16px] font-extrabold text-[#0F172A] tabular-nums">
              {stageStats.saved + stageStats.preparing}건
            </div>
          </div>
          <div>
            <div className="text-[10px] text-neutral-400 font-medium">이번주 마감</div>
            <div className="text-[16px] font-extrabold text-[#E11D48] tabular-nums">
              {stageStats.urgentCount}건
            </div>
          </div>
          <div>
            <div className="text-[10px] text-neutral-400 font-medium">지원/합격</div>
            <div className="text-[16px] font-extrabold text-[#0E9F6E] tabular-nums">
              {stageStats.submitted + stageStats.accepted}건
            </div>
          </div>
        </div>

        <p className="text-[11px] text-neutral-500 leading-relaxed">
          관심 등록한 공고를 칸반 보드에서 '서류 준비중 → 지원 완료'로 체계적으로 관리해보세요.
        </p>
      </div>

      {/* 3. 이달의 마감 캘린더 & .ics 구글 캘린더 내보내기 */}
      <div className="bg-gradient-to-br from-[#0B2A5B] to-[#1D5FC4] text-white rounded-[16px] p-4.5 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-amber-300" />
          <h4 className="text-[13px] font-extrabold">내 구글 캘린더와 연동</h4>
        </div>

        <p className="text-[12px] text-white/80 leading-relaxed mb-3">
          보관함의 마감 일정을 스마트폰과 구글 캘린더에 한 번에 등록하고 마감 알림을 받으세요.
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportAllIcs}
            className="flex-1 py-2 px-3 rounded-[10px] bg-white text-[#0B2A5B] hover:bg-white/90 font-bold text-[12px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.ics 파일 내보내기</span>
          </button>
          <button
            onClick={onGoToCalendar}
            className="py-2 px-3 rounded-[10px] bg-white/15 hover:bg-white/25 text-white font-semibold text-[12px] transition-colors cursor-pointer"
          >
            달력
          </button>
        </div>
      </div>
    </aside>
  );
};
