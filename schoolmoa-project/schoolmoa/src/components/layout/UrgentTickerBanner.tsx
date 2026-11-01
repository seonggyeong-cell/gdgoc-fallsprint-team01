// [담당: 역할 D] 마감 임박 배너
import React from 'react';
import { AlertCircle, ChevronRight, X } from 'lucide-react';
import type { NoticeItem } from '@/types';
import { calculateDDay } from '@/utils/dateUtils';

interface UrgentTickerBannerProps {
  notices: NoticeItem[];
  onFilterClosingSoon: () => void;
}

export const UrgentTickerBanner: React.FC<UrgentTickerBannerProps> = ({
  notices,
  onFilterClosingSoon,
}) => {
  const [dismissed, setDismissed] = React.useState(false);

  // Find notices with D-Day <= 7
  const urgentItems = React.useMemo(() => {
    return notices.filter((n) => {
      if (n.isOngoing) return false;
      const d = calculateDDay(n.deadline);
      return d.diffDays >= 0 && d.diffDays <= 7;
    });
  }, [notices]);

  if (dismissed || urgentItems.length === 0) return null;

  return (
    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-950 px-4 py-2.5 rounded-xl flex items-center justify-between gap-3 text-xs mb-6">
      <div className="flex items-center gap-2.5 truncate">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
        <span className="font-semibold text-amber-900 shrink-0">마감 임박 공고:</span>
        <span className="truncate text-amber-900/90">
          이번 주 마감되는 공고가 <strong className="tabular-nums font-bold">{urgentItems.length}건</strong>{' '}
          있습니다! (
          {urgentItems
            .slice(0, 3)
            .map((u) => u.title)
            .join(', ')}
          {urgentItems.length > 3 ? ' 외' : ''})
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onFilterClosingSoon}
          className="inline-flex items-center gap-1 font-semibold text-amber-900 hover:text-amber-950 underline underline-offset-2 cursor-pointer"
        >
          <span>임박 공고 모아보기</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-amber-800/60 hover:text-amber-950 transition-colors cursor-pointer"
          title="배너 닫기"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
