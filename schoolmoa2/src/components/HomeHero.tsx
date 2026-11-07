import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { NoticeItem } from '../types/notice';
import { DDayBlock } from './DDayBlock';
import { CATEGORIES } from '../constants/categories';

interface HomeHeroProps {
  notices: NoticeItem[];
  urgentCount: number;
  sourceCount?: number;
  onSelectNotice: (notice: NoticeItem) => void;
  onViewAllUrgent: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  notices,
  urgentCount,
  sourceCount = 7,
  onSelectNotice,
  onViewAllUrgent,
}) => {
  // Sort notices by deadline to get top 4 most urgent items
  const urgentCards = React.useMemo(() => {
    return [...notices]
      .filter((n) => !n.isOngoing)
      .slice(0, 4);
  }, [notices]);

  return (
    <div className="relative mb-8">
      {/* Hero Navy Gradient Container */}
      <div className="rounded-[16px] bg-gradient-to-r from-[#0B2A5B] via-[#0D387A] to-[#1D5FC4] text-white pt-7 pb-16 px-6 sm:px-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Title & Value Proposition */}
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-xs text-white/90 text-[12px] font-semibold border border-white/15">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>인하대학교 학생 전용 · 매일 업데이트</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight leading-snug text-white">
              흩어진 학교 기회,
              <br className="sm:hidden" /> 이번 주 놓치면 안 되는{' '}
              <span className="text-amber-400 underline decoration-amber-400/40 decoration-4 underline-offset-4 tabular-nums">
                {urgentCount}건
              </span>
              부터
            </h1>

            <p className="text-[13px] sm:text-[14px] text-white/85 font-normal pt-1">
              교내 근로 · 장학금 · 인턴 · 공모전 · 학사 공지를 한곳에서, 마감일 순으로.
            </p>
          </div>

          {/* Right: 3 Key Metrics Stat Cards (Desktop/Tablet) */}
          <div className="hidden sm:grid grid-cols-3 gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-[12px] border border-white/15 p-3.5 text-center min-w-[90px]">
              <div className="text-[26px] font-extrabold text-white tabular-nums leading-none">
                {notices.length}
              </div>
              <div className="text-[11px] text-white/75 mt-1.5 font-medium">
                모집 중 공고
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-[12px] border border-white/15 p-3.5 text-center min-w-[90px]">
              <div className="text-[26px] font-extrabold text-white tabular-nums leading-none">
                {sourceCount}
              </div>
              <div className="text-[11px] text-white/75 mt-1.5 font-medium">
                연계된 출처 사이트
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-[12px] border border-white/15 p-3.5 text-center min-w-[90px] relative overflow-hidden">
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-400" />
              <div className="text-[26px] font-extrabold text-amber-300 tabular-nums leading-none">
                {urgentCount}
              </div>
              <div className="text-[11px] text-white/75 mt-1.5 font-medium">
                이번 주 마감
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hanging Urgent Cards Strip */}
      <div className="-mt-10 px-2 sm:px-4">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] animate-ping" />
            <span className="text-[14px] font-extrabold text-[#0F172A] flex items-center gap-1.5">
              <span>🔥 마감 임박 공고</span>
              <span className="text-[12px] font-medium text-neutral-500">
                (D-7 이내 우선 확인)
              </span>
            </span>
          </div>

          <button
            onClick={onViewAllUrgent}
            className="text-[12px] font-semibold text-[#1D5FC4] hover:text-[#0B2A5B] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>전체 보기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Cards Grid (or horizontal scroll on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 overflow-x-auto pb-1 scrollbar-none">
          {urgentCards.map((notice) => {
            const cat = CATEGORIES[notice.category] || CATEGORIES.academic;
            const Icon = cat.icon;

            return (
              <div
                key={notice.id}
                onClick={() => onSelectNotice(notice)}
                className="bg-white rounded-[16px] border border-[#E3E8F0] hover:border-[#1D5FC4]/50 hover:shadow-md transition-all p-3.5 flex items-start gap-3 cursor-pointer group shrink-0 min-w-[260px] sm:min-w-0"
              >
                {/* 58px D-Day Block */}
                <DDayBlock deadline={notice.deadline} isOngoing={notice.isOngoing} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] mb-1">
                    <span
                      className="inline-flex items-center gap-1 font-bold px-1.5 py-0.5 rounded-[4px]"
                      style={{
                        backgroundColor: cat.bgColorClass.replace('bg-[', '').replace(']', ''),
                        color: cat.color,
                      }}
                    >
                      <Icon className="w-3 h-3 shrink-0" />
                      <span>{cat.shortLabel}</span>
                    </span>
                    <span className="text-neutral-400">·</span>
                    <span className="text-neutral-500 truncate font-medium">
                      {notice.sourceSiteName || notice.organizer}
                    </span>
                  </div>

                  <h3 className="text-[13px] font-bold text-[#0F172A] group-hover:text-[#1D5FC4] transition-colors leading-snug line-clamp-2">
                    {notice.title}
                  </h3>

                  <div className="text-[12px] font-bold text-[#1D5FC4] mt-1.5 truncate">
                    {notice.benefit}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
